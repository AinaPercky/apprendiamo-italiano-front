// src/types/index.ts

/**
 * @file Ce fichier contient toutes les définitions de types TypeScript partagées dans l'application.
 */

// =================================================================
// Types pour la fonctionnalité Flashcards
// =================================================================

/**
 * Représente un paquet (deck) de flashcards.
 */
export interface Deck {
  deck_pk: number;
  name: string;
  cards?: Card[];
  total_attempts?: number;
  total_correct?: number;
}

/**
 * Représente une seule flashcard.
 */
export interface Card {
  card_pk: number;
  deck_pk: number;
  front: string;
  back: string;
  pronunciation?: string;
  image?: string;
  tags?: string[];
  created_at: string;
  next_review: string;
}

/**
 * Données requises pour créer ou mettre à jour une carte.
 * Omet les champs générés par le serveur comme `card_pk`.
 */
export type CardFormData = Omit<Card, 'card_pk' | 'created_at' | 'next_review'> & {
  tags: string; // Le formulaire utilise une chaîne de caractères pour les tags.
};


/**
 * Représente un élément cliquable dans le quiz d'association.
 */
export interface MatchingItem {
    id: string;
    text: string;
    image?: string;
    type: 'front' | 'back';
    cardId: number;
}

// =================================================================
// Types pour la fonctionnalité Bibliothèque Audio
// =================================================================

/**
 * Représente un élément audio dans la bibliothèque.
 */
export interface AudioItem {
    id: number;
    title: string;
    text: string;
    filename: string;
    category: AudioCategory;
    language: AudioLanguage;
    ipa: string | null;
    audio_url: string;
}

/**
 * Catégories valides pour un élément audio.
 */
export type AudioCategory = 'mot' | 'phrase' | 'texte' | 'poème' | 'virelangue';

/**
 * Langues valides pour la génération audio.
 */
export type AudioLanguage = 'it' | 'en' | 'fr' | 'de' | 'es' | 'ru' | 'ja' | 'zh';

/**
 * Structure des données du formulaire pour la création ou la mise à jour d'un élément audio.
 */
export interface AudioFormData {
    title: string;
    text: string;
    category: AudioCategory;
    language: AudioLanguage;
}

// Fix: Add a shared type for audio filters to be used across the application.
// =================================================================
// Types for Audio Filtering
// =================================================================

/**
 * Structure for audio filtering criteria.
 */
export type AudioFilters = {
    searchTerm: string;
    category: AudioCategory | 'all';
    language: AudioLanguage | 'all';
};
