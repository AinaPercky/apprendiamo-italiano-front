// src/features/flashcards/hooks/useDecks.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchDecks, createDeck as apiCreateDeck, deleteDeck as apiDeleteDeck } from '../../../services/flashcardsApi';
import type { Deck } from '../../../types';

/**
 * @file Hook personnalisé pour gérer la logique des decks de flashcards.
 * Encapsule le chargement, la recherche, la création et la suppression des decks.
 */

export const useDecks = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Charge les decks depuis l'API en fonction du terme de recherche.
     * Utilise useCallback pour éviter les re-créations inutiles de la fonction.
     */
    const loadDecks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchDecks(searchTerm);
            setDecks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de charger les decks.');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]);

    // Recharge les decks à chaque fois que le terme de recherche change.
    useEffect(() => {
        loadDecks();
    }, [loadDecks]);

    /**
     * Gère la création d'un nouveau deck.
     * @param name - Le nom du nouveau deck.
     */
    const createDeck = async (name: string) => {
        try {
            await apiCreateDeck(name);
            await loadDecks(); // Recharge la liste pour afficher le nouveau deck
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de créer le deck.');
            throw err; // Propage l'erreur pour que le formulaire puisse l'afficher
        }
    };
    
    /**
     * Gère la suppression d'un deck.
     * @param deckPk - La clé primaire du deck à supprimer.
     */
    const deleteDeck = async (deckPk: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce deck ?')) {
            try {
                await apiDeleteDeck(deckPk);
                setDecks(prevDecks => prevDecks.filter(deck => deck.deck_pk !== deckPk));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Impossible de supprimer le deck.');
            }
        }
    };

    return {
        decks,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        createDeck,
        deleteDeck,
    };
};
