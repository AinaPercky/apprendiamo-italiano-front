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
        <div className="space-y-6 animate-slide-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-serif text-charcoal mb-2 flex items-center gap-3">
                        📚 Mes Decks
                    </h1>
                    <p className="text-gray-600">Organisez vos cartes par thème pour mieux mémoriser</p>
                </div>
                <button
                    onClick={onCreateDeck}
                    className="btn-primary text-white px-6 py-3 rounded-full flex items-center gap-2 shine-effect"
                >
                    <Plus size={20} /> Nouveau Deck
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher un deck..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-2xl text-lg transition-all duration-200 hover:border-italian-green/50"
                />
            </div>

            {isLoading && <div className="flex justify-center p-12"><Loader2 className="animate-spin h-12 w-12 text-olive" /></div>}
            {error && <div className="text-center text-terracotta bg-red-50 p-6 rounded-2xl border-2 border-terracotta/30">{error}</div>}

            {!isLoading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                        <div key={deck.deck_pk} className="glass-card rounded-2xl shadow-lg p-6 card-hover flex flex-col border-2 border-transparent hover:border-italian-green/30">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-semibold font-serif text-charcoal">{deck.name}</h3>
                                <button onClick={() => deleteDeck(deck.deck_pk)} className="text-terracotta hover:text-terracotta-dark p-2 rounded-full hover:bg-red-100 transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 mb-5 flex-grow space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="badge-italian">📝 {deck.cards?.length || 0} cartes</span>
                                </div>
                                <div className="progress-bar mt-3">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${deck.total_attempts && deck.total_correct && deck.total_attempts > 0 ? Math.round((deck.total_correct / deck.total_attempts) * 100) : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Précision: {deck.total_attempts && deck.total_correct && deck.total_attempts > 0 ? Math.round((deck.total_correct / deck.total_attempts) * 100) : 0}%
                                </p>
                            </div>
                            <button
                                onClick={() => onSelectDeck(deck)}
                                className="w-full bg-olive hover:bg-olive-dark text-white py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold hover:shadow-lg"
                            >
                               <BookOpen size={20} /> Ouvrir le deck
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
