import type { VerbData, QuizQuestion, QuizFilters } from '../types';
import { VERB_CATEGORIES, COMMON_VERBS } from '../constants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function callGeminiAPI(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('Clé API Gemini manquante. Veuillez configurer VITE_GEMINI_API_KEY dans votre fichier .env');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                topK: 1,
                topP: 1,
                maxOutputTokens: 4096,
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Erreur API Gemini: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('Réponse invalide de l\'API Gemini');
    }

    return text;
}

export async function fetchConjugation(verb: string): Promise<VerbData> {
    const prompt = `Fournis la conjugaison complète du verbe italien "${verb}" dans TOUS les modes et temps.

Format JSON exact requis (répondre UNIQUEMENT avec du JSON valide, sans texte avant ou après):
{
  "verb": "${verb}",
  "translation": "traduction en français",
  "icon_suggestion": "nom d'une icône lucide-react appropriée",
  "conjugations": [
    {
      "mood": "Indicativo",
      "tenses": [
        {
          "tense": "Presente",
          "conjugations": [
            {"person": "io", "verb": "forme conjuguée"},
            {"person": "tu", "verb": "forme conjuguée"},
            {"person": "lui/lei", "verb": "forme conjuguée"},
            {"person": "noi", "verb": "forme conjuguée"},
            {"person": "voi", "verb": "forme conjuguée"},
            {"person": "loro", "verb": "forme conjuguée"}
          ]
        }
      ]
    }
  ]
}

Inclus TOUS les modes: Indicativo, Congiuntivo, Condizionale, Imperativo, Infinito, Participio, Gerundio.
Pour l'Imperativo, utilise: tu, lui/lei, noi, voi, loro.
Pour Infinito, Participio et Gerundio, adapte les personnes selon les formes existantes.`;

    const responseText = await callGeminiAPI(prompt);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Format de réponse invalide');
    }

    const data: VerbData = JSON.parse(jsonMatch[0]);
    return data;
}

export async function generateQuizQuestion(filters: QuizFilters = {}): Promise<QuizQuestion> {
    let verb = filters.verb;

    if (!verb) {
        let availableVerbs: string[] = [];

        if (filters.verbCategory && filters.verbCategory !== 'All') {
            availableVerbs = VERB_CATEGORIES[filters.verbCategory] || [];
        } else {
            availableVerbs = COMMON_VERBS;
        }

        if (filters.exclude && filters.exclude.length > 0) {
            availableVerbs = availableVerbs.filter(v => !filters.exclude!.includes(v));
        }

        if (availableVerbs.length === 0) {
            availableVerbs = COMMON_VERBS;
        }

        verb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    }

    const modeFilter = filters.mode && filters.mode !== 'All' ? filters.mode : null;
    const tenseFilter = filters.tense && filters.tense !== 'All' ? filters.tense : null;

    let moodInstruction = '';
    let tenseInstruction = '';

    if (modeFilter) {
        moodInstruction = `Le mode DOIT être: ${modeFilter}.`;
    } else {
        moodInstruction = 'Choisis un mode aléatoire parmi: Indicativo, Congiuntivo, Condizionale, Imperativo.';
    }

    if (tenseFilter) {
        tenseInstruction = `Le temps DOIT être: ${tenseFilter}.`;
    } else {
        tenseInstruction = 'Choisis un temps aléatoire approprié pour ce mode.';
    }

    const prompt = `Génère une question de quiz pour le verbe italien "${verb}".
${moodInstruction}
${tenseInstruction}

Format JSON exact requis (répondre UNIQUEMENT avec du JSON valide, sans texte avant ou après):
{
  "verb": "${verb}",
  "translation": "traduction en français",
  "mood": "nom du mode",
  "tense": "nom du temps",
  "icon_suggestion": "nom d'une icône lucide-react appropriée",
  "conjugations": [
    {"person": "io", "verb": "forme conjuguée"},
    {"person": "tu", "verb": "forme conjuguée"},
    {"person": "lui/lei", "verb": "forme conjuguée"},
    {"person": "noi", "verb": "forme conjuguée"},
    {"person": "voi", "verb": "forme conjuguée"},
    {"person": "loro", "verb": "forme conjuguée"}
  ]
}

Pour l'Imperativo, adapte les personnes (tu, lui/lei, noi, voi, loro).`;

    const responseText = await callGeminiAPI(prompt);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Format de réponse invalide');
    }

    const data: QuizQuestion = JSON.parse(jsonMatch[0]);
    return data;
}
