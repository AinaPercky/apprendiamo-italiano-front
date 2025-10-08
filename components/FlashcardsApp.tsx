// src/components/FlashcardsApp.tsx

import React, { useState } from 'react';
import type { Deck, Card } from '../types';

import { DeckListView } from '../features/flashcards/components/DeckListView';
import { CardListView } from '../features/flashcards/components/CardListView';
import { QuizView } from '../features/flashcards/components/QuizView';
import { DeckForm } from '../features/flashcards/components/DeckForm';
import { CardForm } from '../features/flashcards/components/CardForm';

/**
 * @file Conteneur principal pour la fonctionnalité Flashcards.
 * Ce composant agit comme un routeur, affichant les différentes vues (liste de decks,
 * liste de cartes, quiz, formulaires) en fonction de l'état de l'application.
 * Il maintient l'état de la vue actuelle et le deck sélectionné.
 */

// Définit les différentes vues possibles dans la section flashcards.
export type FlashcardView = 'decks' | 'cards' | 'quiz' | 'create-deck' | 'create-card' | 'edit-card';

const FlashcardsApp: React.FC = () => {
    // État pour gérer la vue actuellement affichée à l'utilisateur.
    const [currentView, setCurrentView] = useState<FlashcardView>('decks');
    
    // État pour stocker le deck actuellement sélectionné par l'utilisateur.
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

    // État pour stocker la carte en cours d'édition.
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    
    // État pour le type de quiz ('typing' ou 'matching').
    const [quizType, setQuizType] = useState<'typing' | 'matching'>('typing');

    // =================================================================
    // Fonctions de navigation
    // =================================================================

    const navigateTo = (view: FlashcardView) => setCurrentView(view);

    const handleSelectDeck = (deck: Deck) => {
        setSelectedDeck(deck);
        navigateTo('cards');
    };

    const handleReturnToDecks = () => {
        setSelectedDeck(null);
        navigateTo('decks');
    };

    const handleStartQuiz = (deck: Deck, type: 'typing' | 'matching') => {
        setSelectedDeck(deck);
        setQuizType(type);
        navigateTo('quiz');
    }

    const handleCreateCard = (deck: Deck) => {
        setSelectedDeck(deck);
        setEditingCard(null);
        navigateTo('create-card');
    }

    const handleEditCard = (deck: Deck, card: Card) => {
        setSelectedDeck(deck);
        setEditingCard(card);
        navigateTo('edit-card');
    }
    
    const handleReturnToCards = () => {
        if (selectedDeck) {
             navigateTo('cards');
        } else {
            // Sécurité si selectedDeck est null
            handleReturnToDecks();
        }
    }


    // =================================================================
    // Rendu des vues
    // =================================================================

    const renderContent = () => {
        switch (currentView) {
            case 'decks':
                return (
                    <DeckListView
                        onSelectDeck={handleSelectDeck}
                        onCreateDeck={() => navigateTo('create-deck')}
                    />
                );
            case 'cards':
                if (!selectedDeck) return <DeckListView onSelectDeck={handleSelectDeck} onCreateDeck={() => navigateTo('create-deck')} />;
                return (
                    <CardListView
                        deck={selectedDeck}
                        onReturnToDecks={handleReturnToDecks}
                        onStartQuiz={(type) => handleStartQuiz(selectedDeck, type)}
                        onCreateCard={() => handleCreateCard(selectedDeck)}
                        onEditCard={(card) => handleEditCard(selectedDeck, card)}
                    />
                );
            case 'quiz':
                 if (!selectedDeck) return null;
                 return <QuizView deck={selectedDeck} quizType={quizType} onReturnToCards={handleReturnToCards} />;
            
            case 'create-deck':
                return <DeckForm onFinish={handleReturnToDecks} />;
            
            case 'create-card':
                if (!selectedDeck) return null;
                return <CardForm deckId={selectedDeck.deck_pk} onFinish={handleReturnToCards} />;

            case 'edit-card':
                if (!selectedDeck || !editingCard) return null;
                return <CardForm deckId={selectedDeck.deck_pk} cardToEdit={editingCard} onFinish={handleReturnToCards} />;

            default:
                return <div>Vue inconnue</div>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {renderContent()}
        </div>
    );
};

export default FlashcardsApp;
