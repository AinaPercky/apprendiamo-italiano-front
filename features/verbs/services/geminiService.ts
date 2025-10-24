import { GoogleGenAI, Type } from "@google/genai";
import type { VerbData, QuizQuestion, QuizFilters } from '../types';
import { VERB_CATEGORIES, COMMON_VERBS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Retries an async function with exponential backoff.
 * This is useful for handling transient errors like API rate limiting or temporary unavailability.
 * @param apiCall The async function to retry.
 * @param maxRetries The maximum number of times to retry.
 * @param initialDelay The initial delay in milliseconds before the first retry.
 * @returns The result of the successful API call.
 */
async function retryWithBackoff<T>(
    apiCall: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await apiCall();
        } catch (error: any) {
            attempt++;
            // Check for a specific, retryable error status (e.g., 503 Unavailable)
            const isRetryable = error.message?.includes('503') || error.message?.includes('UNAVAILABLE');

            if (isRetryable && attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt - 1);
                console.warn(`API Error (Attempt ${attempt}): Model overloaded. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // If the error is not retryable or max retries are reached, throw the error.
                console.error(`API Error (Attempt ${attempt}): Giving up.`, error);
                throw error;
            }
        }
    }
}


export async function fetchConjugation(verb: string): Promise<VerbData> {
    const prompt = `Fournis la conjugaison complète du verbe italien "${verb}" dans TOUS les modes et temps.

Inclus TOUS les modes: Indicativo, Congiuntivo, Condizionale, Imperativo, Infinito, Participio, Gerundio.
Pour l'Imperativo, utilise: tu, lui/lei, noi, voi, loro.
Pour Infinito, Participio et Gerundio, adapte les personnes selon les formes existantes.`;

    const apiCall = () => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    verb: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    icon_suggestion: { type: Type.STRING },
                    conjugations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                mood: { type: Type.STRING },
                                tenses: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            tense: { type: Type.STRING },
                                            conjugations: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        person: { type: Type.STRING },
                                                        verb: { type: Type.STRING }
                                                    },
                                                    required: ["person", "verb"]
                                                }
                                            }
                                        },
                                        required: ["tense", "conjugations"]
                                    }
                                }
                            },
                            required: ["mood", "tenses"]
                        }
                    }
                },
                required: ["verb", "translation", "icon_suggestion", "conjugations"]
            },
        },
    });

    try {
        const response = await retryWithBackoff(apiCall);
        
        const jsonText = response.text.trim();
        const data: VerbData = JSON.parse(jsonText);
        return data;
    } catch (error) {
        console.error("Erreur API Gemini (fetchConjugation):", error);
        throw new Error("Impossible de récupérer les conjugaisons. Veuillez réessayer.");
    }
}

export async function generateQuizQuestion(filters: QuizFilters = {}): Promise<QuizQuestion> {
    let verb = filters.verb;

    if (!verb) {
        let availableVerbs: string[] = [];

        if (filters.verbCategory && filters.verbCategory !== 'All') {
            availableVerbs = VERB_CATEGORIES[filters.verbCategory as keyof typeof VERB_CATEGORIES] || [];
        } else {
            availableVerbs = COMMON_VERBS;
        }

        if (filters.exclude && filters.exclude.length > 0) {
            availableVerbs = availableVerbs.filter(v => !filters.exclude!.includes(v));
        }

        if (availableVerbs.length === 0) {
            availableVerbs = COMMON_VERBS; // Fallback
        }

        verb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    }

    const modeFilter = filters.mode && filters.mode !== 'All' ? filters.mode : null;
    const tenseFilter = filters.tense && filters.tense !== 'All' ? filters.tense : null;

    let moodInstruction = modeFilter 
        ? `Le mode DOIT être: ${modeFilter}.` 
        : 'Choisis un mode aléatoire parmi: Indicativo, Congiuntivo, Condizionale, Imperativo.';
    
    let tenseInstruction = tenseFilter 
        ? `Le temps DOIT être: ${tenseFilter}.` 
        : 'Choisis un temps aléatoire approprié pour ce mode.';

    const prompt = `Génère une question de quiz pour le verbe italien "${verb}".
${moodInstruction}
${tenseInstruction}
Pour l'Imperativo, adapte les personnes (tu, lui/lei, noi, voi, loro).`;

    const apiCall = () => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    verb: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    mood: { type: Type.STRING },
                    tense: { type: Type.STRING },
                    icon_suggestion: { type: Type.STRING },
                    conjugations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                person: { type: Type.STRING },
                                verb: { type: Type.STRING }
                            },
                            required: ["person", "verb"]
                        }
                    }
                },
                required: ["verb", "translation", "mood", "tense", "icon_suggestion", "conjugations"]
            },
        },
    });

    try {
        const response = await retryWithBackoff(apiCall);

        const jsonText = response.text.trim();
        const data: QuizQuestion = JSON.parse(jsonText);
        return data;

    } catch (error) {
        console.error("Erreur API Gemini (generateQuizQuestion):", error);
        throw new Error("Impossible de générer la question du quiz. Veuillez réessayer.");
    }
}