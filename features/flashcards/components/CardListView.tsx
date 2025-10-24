// src/features/flashcards/components/CardListView.tsx

import React, { useState } from 'react';
import { useCards } from '../hooks/useCards';
import type { Deck, Card } from '../../../types';
import { ChevronsLeft, Edit, Link as LinkIcon, Plus, Trash2, Mic, Loader2, CheckSquare, Repeat, Upload } from 'lucide-react';
import { CardImport } from './CardImport';

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
        reloadCards,
    } = useCards(deck.deck_pk);

    const [showImport, setShowImport] = useState(false);

    const handleImportComplete = (successCount: number) => {
        setShowImport(false);
        reloadCards();
    };

    return (
        <div className="space-y-6 animate-slide-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <button onClick={onReturnToDecks} className="text-olive hover:text-olive-dark mb-3 flex items-center gap-2 font-semibold px-4 py-2 rounded-full hover:bg-olive/10 transition-all">
                        <ChevronsLeft size={20} /> Retour aux decks
                    </button>
                    <h1 className="text-4xl font-bold font-serif text-charcoal">🎯 {deck.name}</h1>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => onStartQuiz('typing')} className="bg-olive hover:bg-olive-dark text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all" disabled={cards.length === 0}><Edit size={18} /> Frappe</button>
                    <button onClick={() => onStartQuiz('matching')} className="bg-olive-light hover:bg-olive text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all" disabled={cards.length === 0}><LinkIcon size={18} /> Association</button>
                    <button onClick={() => onStartQuiz('multiple-choice')} className="bg-olive-dark hover:bg-olive-light text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all" disabled={cards.length === 0}><CheckSquare size={18} /> QCM</button>
                    <button onClick={() => onStartQuiz('until-perfect')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all" disabled={cards.length === 0}><Repeat size={18} /> Parfait</button>
                    <button onClick={() => setShowImport(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><Upload size={18} /> Importer</button>
                    <button onClick={onCreateCard} className="btn-primary text-white px-6 py-2.5 rounded-full flex items-center gap-2 shine-effect"><Plus size={20} /> Nouvelle Carte</button>
                </div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher une carte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-2xl text-lg transition-all duration-200 hover:border-italian-green/50"
                />
            </div>

            {isLoading && <div className="flex justify-center p-12"><Loader2 className="animate-spin h-12 w-12 text-olive" /></div>}
            {error && <div className="text-center text-terracotta bg-red-50 p-6 rounded-2xl border-2 border-terracotta/30">{error}</div>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.card_pk} className="glass-card border-2 border-transparent rounded-2xl shadow-lg p-6 card-hover hover:border-italian-green/30">
                            <div className="flex justify-end mb-3 gap-2">
                                <button onClick={() => onEditCard(card)} className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10 transition-all"><Edit size={20} /></button>
                                <button onClick={() => deleteCard(card.card_pk)} className="text-terracotta hover:text-terracotta-dark p-2 rounded-full hover:bg-red-100 transition-all"><Trash2 size={20} /></button>
                            </div>
                            {card.image && <div className="mb-4 flex justify-center"><img src={card.image} alt="Card" className="max-w-full h-40 object-contain rounded-xl bg-gray-50 p-3 shadow-sm" /></div>}
                            <div className="space-y-3">
                                <p className="text-gray-600 text-base">{card.front}</p>
                                <p className="text-xl font-bold text-italian-green">{card.back}</p>
                                {card.pronunciation && <p className="text-sm text-olive flex items-center gap-2 bg-olive/10 px-3 py-1.5 rounded-full font-medium"><Mic size={16} /> {card.pronunciation}</p>}
                                {card.tags && card.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {card.tags.map((tag, index) => <span key={index} className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{tag}</span>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showImport && (
                <CardImport
                    deckId={deck.deck_pk}
                    onImportComplete={handleImportComplete}
                    onClose={() => setShowImport(false)}
                />
            )}
        </div>
    );
};