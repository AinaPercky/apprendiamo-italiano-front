// src/features/flashcards/components/DeckListView.tsx

import React from 'react';
import { useDecks } from '../hooks/useDecks';
import type { Deck } from '../../../types';
import { Plus, Trash2, BookOpen, Loader2 } from 'lucide-react';

/**
 * @file Affiche la liste des decks de flashcards.
 * Gère la recherche, l'affichage, la suppression et la navigation vers un deck ou la création.
 */

interface DeckListViewProps {
    /** Fonction à appeler lorsqu'un utilisateur sélectionne un deck. */
    onSelectDeck: (deck: Deck) => void;
    /** Fonction à appeler lorsque l'utilisateur veut créer un nouveau deck. */
    onCreateDeck: () => void;
}

export const DeckListView: React.FC<DeckListViewProps> = ({ onSelectDeck, onCreateDeck }) => {
    const {
        decks,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        deleteDeck,
    } = useDecks();

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // La recherche se déclenche automatiquement via le useEffect dans le hook `useDecks`.
        // Cette fonction pourrait être utilisée pour une recherche manuelle sur 'Enter'.
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-serif text-charcoal">Mes Decks</h1>
                <button
                    onClick={onCreateDeck}
                    className="bg-italian-green hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Nouveau Deck
                </button>
            </div>
            
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher un deck..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                />
            </div>

            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin h-10 w-10 text-olive" /></div>}
            {error && <div className="text-center text-terracotta bg-red-100 p-4 rounded-lg">{error}</div>}

            {!isLoading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                        <div key={deck.deck_pk} className="bg-italian-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold font-serif text-charcoal">{deck.name}</h3>
                                <button onClick={() => deleteDeck(deck.deck_pk)} className="text-terracotta hover:text-terracotta-dark p-1 rounded-full hover:bg-red-100">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 mb-4 flex-grow">
                                <p>Cartes: {deck.cards?.length || 0}</p>
                                <p>Précision: {deck.total_attempts && deck.total_correct && deck.total_attempts > 0 ? Math.round((deck.total_correct / deck.total_attempts) * 100) : 0}%</p>
                            </div>
                            <button
                                onClick={() => onSelectDeck(deck)}
                                className="w-full bg-olive hover:bg-olive-dark text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                               <BookOpen size={18} /> Ouvrir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
