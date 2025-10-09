// src/features/flashcards/hooks/useQuiz.ts

import { useState, useEffect, useMemo } from 'react';
import type { Card, MatchingItem } from '../../../types';
import { normalizeText } from '../../../utils/textUtils';

/**
 * @file Hook personnalisé pour encapsuler toute la logique d'un quiz de flashcards.
 * Gère les modes "typing", "matching", "multiple-choice" et "until-perfect", le score, la progression et l'état de complétion.
 * @param cards - La liste des cartes à utiliser pour le quiz.
 * @param quizType - Le type de quiz : 'typing', 'matching', 'multiple-choice' ou 'until-perfect'.
 */
export const useQuiz = (cards: Card[], quizType: 'typing' | 'matching' | 'multiple-choice' | 'until-perfect') => {
    // État général du quiz
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [isComplete, setIsComplete] = useState(false);

    // État partagé pour les quiz basés sur des cartes individuelles (typing, multiple-choice, until-perfect)
    const [quizCards, setQuizCards] = useState<Card[]>([]);
    const [pendingCards, setPendingCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [errors, setErrors] = useState<Card[]>([]);

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

        if (quizType === 'typing' || quizType === 'multiple-choice') {
            setQuizCards(shuffled);
            setCurrentIndex(0);
            setUserInput('');
            setShowAnswer(false);
            setScore({ correct: 0, total: 0 }); // Le total augmente à chaque réponse
        } else if (quizType === 'until-perfect') {
            setPendingCards(shuffled);
            setCurrentIndex(0);
            setUserInput('');
            setShowAnswer(false);
            setErrors([]);
            setScore({ correct: 0, total: cards.length }); // Le total est fixe
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

    const currentCard = useMemo(() => {
        if (quizType === 'until-perfect') return pendingCards[currentIndex];
        return quizCards[currentIndex];
    }, [quizType, pendingCards, quizCards, currentIndex]);

    const options = useMemo(() => {
        if (quizType !== 'multiple-choice' || !currentCard) return [];
        const correct = currentCard.back;
        let wrongs = quizCards
            .filter(c => c.card_pk !== currentCard.card_pk && normalizeText(c.back) !== normalizeText(correct))
            .map(c => c.back);
        const uniqueWrongs = [...new Set(wrongs)];
        const selectedWrongs = [];
        for (let i = 0; i < 3 && uniqueWrongs.length > 0; i++) {
            const idx = Math.floor(Math.random() * uniqueWrongs.length);
            selectedWrongs.push(uniqueWrongs.splice(idx, 1)[0]);
        }
        const allOptions = [correct, ...selectedWrongs];
        return allOptions.sort(() => Math.random() - 0.5);
    }, [quizType, currentCard, quizCards]);

    // =================================================================
    // Logique pour les Quiz basés sur des cartes individuelles (typing, multiple-choice, until-perfect)
    // =================================================================

    const checkAnswer = () => {
        if (!currentCard || quizType === 'matching') return;
        const isCorrect = normalizeText(userInput) === normalizeText(currentCard.back);

        if (quizType !== 'until-perfect') {
            setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
        } else if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        }

        setShowAnswer(true);

        setTimeout(() => {
            let nextIndex = currentIndex + 1;
            const currentListLength = quizType === 'until-perfect' ? pendingCards.length : quizCards.length;
            const isEndOfRound = nextIndex >= currentListLength;

            if (!isCorrect && quizType === 'until-perfect') {
                setErrors(prev => [...prev, currentCard]);
            }

            if (!isEndOfRound) {
                setCurrentIndex(nextIndex);
                setUserInput('');
                setShowAnswer(false);
            } else {
                if (quizType === 'until-perfect' && errors.length > 0) {
                    const newPending = [...errors].sort(() => Math.random() - 0.5);
                    setPendingCards(newPending);
                    setErrors([]);
                    setCurrentIndex(0);
                    setUserInput('');
                    setShowAnswer(false);
                } else {
                    setIsComplete(true);
                }
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
        // Quiz basés sur cartes individuelles
        currentCard,
        userInput,
        setUserInput,
        showAnswer,
        checkAnswer,
        quizCards,
        pendingCards,
        currentIndex,
        options,
        // Quiz Matching
        leftItems,
        rightItems,
        selectedItems,
        matchedPairs,
        handleItemSelect,
        getMatchingItemStyle,
    };
};