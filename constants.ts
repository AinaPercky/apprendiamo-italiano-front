// src/constants/index.ts

/**
 * @file Ce fichier centralise toutes les constantes utilisées dans l'application.
 */

import type { AudioCategory, AudioLanguage } from './types';

/**
 * URL de base pour l'API des Flashcards.
 */
export const FLASHCARDS_API_BASE = 'http://localhost:8000';

/**
 * URL de base pour l'API Audio.
 */
export const AUDIO_API_BASE = 'http://localhost:5000';

/**
 * Liste des catégories audio disponibles pour les formulaires et les filtres.
 */
export const AUDIO_CATEGORIES: { value: AudioCategory; label: string }[] = [
    { value: 'mot', label: 'Mot' },
    { value: 'phrase', label: 'Phrase' },
    { value: 'texte', label: 'Texte' },
    { value: 'poème', label: 'Poème' },
    { value: 'virelangue', label: 'Virelangue' },
];

/**
 * Liste des langues disponibles pour les formulaires et les filtres, avec leur drapeau associé.
 */
export const AUDIO_LANGUAGES: { value: AudioLanguage; label: string, flag: string }[] = [
    { value: 'it', label: 'Italien', flag: '🇮🇹' },
    { value: 'en', label: 'Anglais', flag: '🇬🇧' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Allemand', flag: '🇩🇪' },
    { value: 'es', label: 'Espagnol', flag: '🇪🇸' },
    { value: 'ru', label: 'Russe', flag: '🇷🇺' },
    { value: 'ja', label: 'Japonais', flag: '🇯🇵' },
    { value: 'zh', label: 'Chinois', flag: '🇨🇳' },
];