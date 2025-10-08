// src/features/flashcards/hooks/useCards.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchCardsByDeck, deleteCard as apiDeleteCard, createCard as apiCreateCard, updateCard as apiUpdateCard } from '../../../services/flashcardsApi';
import type { Card, CardFormData } from '../../../types';

/**
 * @file Hook personnalisé pour gérer la logique des cartes d'un deck spécifique.
 * @param deckPk - La clé primaire du deck dont les cartes sont gérées.
 */
export const useCards = (deckPk: number) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Charge les cartes du deck depuis l'API.
     */
    const loadCards = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCardsByDeck(deckPk, searchTerm);
            setCards(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de charger les cartes.');
        } finally {
            setIsLoading(false);
        }
    }, [deckPk, searchTerm]);

    // Recharge les cartes si le deck ou le terme de recherche change.
    useEffect(() => {
        if (deckPk) {
            loadCards();
        }
    }, [loadCards, deckPk]);

    /**
     * Gère la suppression d'une carte.
     * @param cardPk - La clé primaire de la carte à supprimer.
     */
    const deleteCard = async (cardPk: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
            try {
                await apiDeleteCard(cardPk);
                setCards(prevCards => prevCards.filter(card => card.card_pk !== cardPk));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Impossible de supprimer la carte.');
            }
        }
    };

     /**
     * Gère la création d'une nouvelle carte.
     * @param cardData - Les données du formulaire de la carte.
     */
    const createCard = async (cardData: Omit<Card, 'card_pk'|'deck_pk' | 'created_at' | 'next_review'>) => {
        try {
             const newCardData = { ...cardData, deck_pk: deckPk };
             await apiCreateCard(newCardData);
             await loadCards(); // Recharger pour voir la nouvelle carte
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création de la carte.');
            throw err;
        }
    };

    /**
     * Gère la mise à jour d'une carte existante.
     * @param cardPk - L'ID de la carte à mettre à jour.
     * @param cardData - Les données du formulaire de la carte.
     */
    const updateCard = async (cardPk: number, cardData: Partial<CardFormData>) => {
        try {
            await apiUpdateCard(cardPk, cardData);
            await loadCards(); // Recharger pour voir les modifications
        } catch (err) {
             setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la carte.');
             throw err;
        }
    };


    return {
        cards,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        deleteCard,
        createCard,
        updateCard,
        reloadCards: loadCards
    };
};
