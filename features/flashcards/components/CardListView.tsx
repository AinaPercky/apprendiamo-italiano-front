// src/features/flashcards/components/CardListView.tsx

import React from 'react';
import { useCards } from '../hooks/useCards';
import type { Deck, Card } from '../../../types';
import { ChevronsLeft, Edit, Link as LinkIcon, Plus, Trash2, Mic, Loader2, CheckSquare, Repeat } from 'lucide-react';

/**
 * @file Affiche la liste des cartes d'un deck sélectionné.
 * Permet de lancer un quiz, de créer/modifier/supprimer des cartes et de revenir à la liste des decks.
 */

interface CardListViewProps {
    deck: Deck;
    onReturnToDecks: () => void;
    onStartQuiz: (type: 'typing' | 'matching' | 'multiple-choice' | 'until-perfect') => void;
    onCreateCard: () => void;
    onEditCard: (card: Card) => void;
}

export const CardListView: React.FC<CardListViewProps> = ({ deck, onReturnToDecks, onStartQuiz, onCreateCard, onEditCard }) => {
    const {
        cards,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        deleteCard,
    } = useCards(deck.deck_pk);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <button onClick={onReturnToDecks} className="text-olive hover:underline mb-2 flex items-center gap-2">
                        <ChevronsLeft size={18} /> Retour aux decks
                    </button>
                    <h1 className="text-3xl font-bold font-serif text-charcoal">{deck.name}</h1>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => onStartQuiz('typing')} className="bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={cards.length === 0}><Edit size={18} /> Quiz Frappe</button>
                    <button onClick={() => onStartQuiz('matching')} className="bg-olive-light hover:bg-olive text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={cards.length === 0}><LinkIcon size={18} /> Quiz Association</button>
                    <button onClick={() => onStartQuiz('multiple-choice')} className="bg-olive-dark hover:bg-olive-light text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={cards.length === 0}><CheckSquare size={18} /> Quiz QCM</button>
                    <button onClick={() => onStartQuiz('until-perfect')} className="bg-italian-green-light hover:bg-italian-green text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={cards.length === 0}><Repeat size={18} /> Quiz Jusqu'à 100%</button>
                    <button onClick={onCreateCard} className="bg-italian-green hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Nouvelle Carte</button>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher une carte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                />
            </div>

            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin h-10 w-10 text-olive" /></div>}
            {error && <div className="text-center text-terracotta bg-red-100 p-4 rounded-lg">{error}</div>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.card_pk} className="bg-italian-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex justify-end mb-2 gap-2">
                                <button onClick={() => onEditCard(card)} className="text-olive hover:text-olive-dark p-1 rounded-full hover:bg-olive/10"><Edit size={18} /></button>
                                <button onClick={() => deleteCard(card.card_pk)} className="text-terracotta hover:text-terracotta-dark p-1 rounded-full hover:bg-red-100"><Trash2 size={18} /></button>
                            </div>
                            {card.image && <div className="mb-4 flex justify-center"><img src={card.image} alt="Card" className="max-w-full h-40 object-contain rounded-lg bg-gray-50 p-2" /></div>}
                            <div className="space-y-2">
                                <p className="text-gray-600">{card.front}</p>
                                <p className="text-lg font-semibold text-charcoal">{card.back}</p>
                                {card.pronunciation && <p className="text-sm text-olive flex items-center gap-2"><Mic size={14} /> {card.pronunciation}</p>}
                                {card.tags && card.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {card.tags.map((tag, index) => <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tag}</span>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};