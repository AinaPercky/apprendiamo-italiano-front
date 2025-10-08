// src/features/flashcards/hooks/useQuiz.ts

import { useState, useEffect, useMemo } from 'react';
import type { Card, MatchingItem } from '../../../types';
import { normalizeText } from '../../../utils/textUtils';

/**
 * @file Hook personnalisé pour encapsuler toute la logique d'un quiz de flashcards.
 * Gère les modes "typing" et "matching", le score, la progression et l'état de complétion.
 * @param cards - La liste des cartes à utiliser pour le quiz.
 * @param quizType - Le type de quiz : 'typing' ou 'matching'.
 */
export const useQuiz = (cards: Card[], quizType: 'typing' | 'matching') => {
    // État général du quiz
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [isComplete, setIsComplete] = useState(false);

    // État spécifique au quiz "typing"
    const [quizCards, setQuizCards] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    // État spécifique au quiz "matching"
    const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
    const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<MatchingItem[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [wrongMatch, setWrongMatch] = useState<{ first: string; second: string } | null>(null);
    const [justMatched, setJustMatched] = useState<number | null>(null);

    /**
     * Initialise ou réinitialise le quiz lorsque les cartes ou le type de quiz changent.
     */
    useEffect(() => {
        if (cards.length === 0) return;

        setIsComplete(false);
        const shuffled = [...cards].sort(() => Math.random() - 0.5);

        if (quizType === 'typing') {
            setQuizCards(shuffled);
            setCurrentCardIndex(0);
            setUserAnswer('');
            setShowAnswer(false);
            setScore({ correct: 0, total: 0 }); // Le total augmente à chaque réponse
        } else { // matching
            const fronts: MatchingItem[] = shuffled.map(c => ({ id: `front-${c.card_pk}`, text: c.front, image: c.image, type: 'front', cardId: c.card_pk }));
            const backs: MatchingItem[] = shuffled.map(c => ({ id: `back-${c.card_pk}`, text: c.back, type: 'back', cardId: c.card_pk }));
            setLeftItems(fronts.sort(() => Math.random() - 0.5));
            setRightItems(backs.sort(() => Math.random() - 0.5));
            setSelectedItems([]);
            setMatchedPairs([]);
            setWrongMatch(null);
            setJustMatched(null);
            setScore({ correct: 0, total: cards.length }); // Le total est fixe
        }
    }, [cards, quizType]);

    const currentCard = useMemo(() => quizCards[currentCardIndex], [quizCards, currentCardIndex]);

    // =================================================================
    // Logique pour le Quiz "Typing"
    // =================================================================

    const checkAnswer = () => {
        if (!currentCard) return;
        const isCorrect = normalizeText(userAnswer) === normalizeText(currentCard.back);
        setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
        setShowAnswer(true);

        setTimeout(() => {
            if (currentCardIndex < quizCards.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
                setUserAnswer('');
                setShowAnswer(false);
            } else {
                setIsComplete(true);
            }
        }, 2000);
    };

    // =================================================================
    // Logique pour le Quiz "Matching"
    // =================================================================

    const handleItemSelect = (item: MatchingItem) => {
        if (selectedItems.some(s => s.id === item.id) || matchedPairs.includes(item.cardId) || justMatched === item.cardId) return;
        if (selectedItems.length === 1 && selectedItems[0].type === item.type) return;

        const newSelected = [...selectedItems, item];
        setSelectedItems(newSelected);

        if (newSelected.length === 2) {
            const [first, second] = newSelected;
            if (first.cardId === second.cardId) { // Bonne paire
                setJustMatched(first.cardId);
                setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
                setSelectedItems([]);
                setTimeout(() => {
                    const newMatched = [...matchedPairs, first.cardId];
                    setMatchedPairs(newMatched);
                    setJustMatched(null);
                    if (newMatched.length === score.total) {
                        setIsComplete(true);
                    }
                }, 200);
            } else { // Mauvaise paire
                setWrongMatch({ first: first.id, second: second.id });
                setTimeout(() => {
                    setSelectedItems([]);
                    setWrongMatch(null);
                }, 1000);
            }
        }
    };
    
    /**
     * Calcule le style d'un item du quiz d'association en fonction de son état.
     */
    const getMatchingItemStyle = (item: MatchingItem) => {
        if (justMatched === item.cardId) return 'bg-green-100 border-italian-green text-green-800 cursor-not-allowed animate-fade-out';
        if (wrongMatch && (wrongMatch.first === item.id || wrongMatch.second === item.id)) return 'bg-red-100 border-terracotta text-red-800';
        if (selectedItems.some(s => s.id === item.id)) return 'bg-olive/20 border-olive text-charcoal';
        return 'bg-italian-white border-gray-300 text-charcoal hover:bg-gray-50';
    };

    return {
        // État général
        score,
        isComplete,
        // Quiz Typing
        currentCard,
        userAnswer,
        setUserAnswer,
        showAnswer,
        checkAnswer,
        quizCards,
        currentCardIndex,
        // Quiz Matching
        leftItems,
        rightItems,
        selectedItems,
        matchedPairs,
        handleItemSelect,
        getMatchingItemStyle,
    };
};