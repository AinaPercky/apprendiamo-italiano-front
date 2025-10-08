// src/services/flashcardsApi.ts

import { FLASHCARDS_API_BASE } from '../constants';
import type { Deck, Card, CardFormData } from '../types';

/**
 * @file Ce fichier centralise tous les appels API pour la fonctionnalité Flashcards.
 * Chaque fonction correspond à une route du backend.
 */

const API_BASE = FLASHCARDS_API_BASE;

/**
 * Gère les erreurs de réponse de l'API.
 * @param response - L'objet Response de l'API fetch.
 * @throws {Error} Lance une erreur si la réponse n'est pas OK.
 */
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
        throw new Error(errorData.detail || `Erreur API: ${response.statusText}`);
    }
    return response.json();
};

// =================================================================
// Fonctions API pour les Decks
// =================================================================

export const fetchDecks = (searchTerm: string = ''): Promise<Deck[]> => {
    return fetch(`${API_BASE}/decks/?search=${searchTerm}&limit=1000`).then(handleApiResponse);
};

export const createDeck = (name: string): Promise<Deck> => {
    return fetch(`${API_BASE}/decks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    }).then(handleApiResponse);
};

export const deleteDeck = (deckPk: number): Promise<void> => {
    return fetch(`${API_BASE}/decks/${deckPk}`, { method: 'DELETE' }).then(response => {
        if (!response.ok) throw new Error('Échec de la suppression du deck.');
    });
};


// =================================================================
// Fonctions API pour les Cartes
// =================================================================

export const fetchCardsByDeck = (deckPk: number, searchTerm: string = ''): Promise<Card[]> => {
    return fetch(`${API_BASE}/cards/?deck_pk=${deckPk}&search=${searchTerm}&limit=1000`).then(handleApiResponse);
};

export const createCard = (cardData: Omit<Card, 'card_pk' | 'created_at' | 'next_review'>): Promise<Card> => {
    const payload = {
        ...cardData,
        tags: Array.isArray(cardData.tags) ? cardData.tags : [],
        created_at: new Date().toISOString(),
        next_review: new Date().toISOString()
    };
    return fetch(`${API_BASE}/cards/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(handleApiResponse);
};


export const updateCard = (cardPk: number, cardData: Partial<CardFormData>): Promise<Card> => {
     const payload = {
        ...cardData,
        // Le formulaire envoie les tags comme une string, le backend attend un array
        tags: typeof cardData.tags === 'string' 
            ? cardData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : cardData.tags,
    };
    return fetch(`${API_BASE}/cards/${cardPk}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(handleApiResponse);
};

export const deleteCard = (cardPk: number): Promise<void> => {
    return fetch(`${API_BASE}/cards/${cardPk}`, { method: 'DELETE' }).then(response => {
        if (!response.ok) throw new Error('Échec de la suppression de la carte.');
    });
};
