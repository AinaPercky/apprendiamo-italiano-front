export interface ConjugationPair {
    person: string;
    verb: string;
}

export interface TenseData {
    tense: string;
    conjugations: ConjugationPair[];
}

export interface MoodData {
    mood: string;
    tenses: TenseData[];
}

export interface VerbData {
    verb: string;
    translation: string;
    icon_suggestion: string;
    conjugations: MoodData[];
}

export interface QuizQuestion {
    verb: string;
    translation: string;
    mood: string;
    tense: string;
    icon_suggestion: string;
    conjugations: ConjugationPair[];
}

export interface QuizFilters {
    verbCategory?: string;
    mode?: string;
    tense?: string;
    verb?: string;
    exclude?: string[];
}
