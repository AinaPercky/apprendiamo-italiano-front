// src/features/flashcards/components/QuizView.tsx

import React from 'react';
import type { Deck } from '../../../types';
import { useCards } from '../hooks/useCards';
import { useQuiz } from '../hooks/useQuiz';
import { Loader2, ArrowLeft, RefreshCw, CheckCircle, XCircle, Shuffle } from 'lucide-react';
// Fix: Import normalizeText to be used for comparing answers.
import { normalizeText } from '../../../utils/textUtils';

/**
 * @file Affiche l'interface du quiz, que ce soit en mode "typing" ou "matching".
 * Utilise le `useQuiz` hook pour gérer la logique complexe du jeu.
 */

interface QuizViewProps {
    deck: Deck;
    quizType: 'typing' | 'matching';
    onReturnToCards: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ deck, quizType, onReturnToCards }) => {
    const { cards, isLoading: isLoadingCards } = useCards(deck.deck_pk);
    const {
        score,
        isComplete,
        currentCard,
        userAnswer,
        setUserAnswer,
        showAnswer,
        checkAnswer,
        quizCards,
        currentCardIndex,
        leftItems,
        rightItems,
        matchedPairs,
        handleItemSelect,
        getMatchingItemStyle,
    } = useQuiz(cards, quizType);

    if (isLoadingCards) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-10 w-10 text-olive" /></div>;
    }

    if (isComplete) {
        const finalScore = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
        return (
            <div className="max-w-md mx-auto bg-italian-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold font-serif text-charcoal mb-6">Quiz Terminé !</h2>
                <div className="text-4xl font-bold text-italian-green mb-4">{score.correct}/{score.total}</div>
                <p className="text-lg text-gray-600 mb-6">Score: {finalScore}%</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => window.location.reload()} className="bg-olive hover:bg-olive-dark text-white px-6 py-2 rounded-lg flex items-center gap-2"><RefreshCw size={18} /> Recommencer</button>
                    <button onClick={onReturnToCards} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg">Retour</button>
                </div>
            </div>
        );
    }

    const shuffleWords = (text: string) => {
        const words = text.split(' ');
        if (words.length <= 2) return words;
        return words.sort(() => Math.random() - 0.5);
    };

    if (quizType === 'matching') {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-green-100/50 p-2 rounded-t-lg border-b-2 border-italian-green">
                    <button onClick={onReturnToCards} className="text-olive hover:text-olive-dark"><ArrowLeft size={20} /></button>
                    <h2 className="text-2xl font-bold font-serif text-charcoal">Quiz d'Association</h2>
                    <div className="text-lg font-semibold text-italian-green">Score: {score.correct}/{score.total}</div>
                </div>
                <div className="bg-italian-white rounded-lg shadow-lg p-6 rounded-b-lg">
                    <p className="text-center text-gray-600 mb-6">Associez les termes français à leurs traductions italiennes.</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">Français 🇫🇷</h3>
                            {leftItems.filter(item => !matchedPairs.includes(item.cardId)).map((item) => (
                                <div key={item.id} onClick={() => handleItemSelect(item)} className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer flex items-center gap-2 ${getMatchingItemStyle(item)}`}>
                                    {item.image && <img src={item.image} alt={item.text} className="w-10 h-10 object-contain" />}
                                    <span className="font-medium text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">Italien 🇮🇹</h3>
                            {rightItems.filter(item => !matchedPairs.includes(item.cardId)).map((item) => (
                                <div key={item.id} onClick={() => handleItemSelect(item)} className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer ${getMatchingItemStyle(item)}`}>
                                    <span className="font-medium text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Quiz "Typing"
    if (!currentCard) return null;
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={onReturnToCards} className="text-olive hover:text-olive-dark"><ArrowLeft size={20} /></button>
                <div className="text-lg font-semibold text-gray-700">{currentCardIndex + 1} / {quizCards.length}</div>
                <div className="text-lg font-semibold text-italian-green">Score: {score.correct}/{score.total}</div>
            </div>
            <div className="bg-italian-white rounded-lg shadow-lg p-8">
                {currentCard.image && <div className="mb-6 flex justify-center"><img src={currentCard.image} alt="Card" className="max-w-full max-h-80 object-contain rounded-lg bg-gray-50 p-4" /></div>}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold font-serif text-charcoal mb-2">{currentCard.front}</h2>
                    {currentCard.pronunciation && <p className="text-olive">{currentCard.pronunciation}</p>}
                </div>
                 <div className="space-y-4">
                    <div className="flex flex-col items-center">
                        <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Votre réponse en italien..." className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-2 focus:ring-olive focus:border-transparent" onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()} disabled={showAnswer} />
                    </div>
                    {currentCard.back.split(' ').length > 2 && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2"><Shuffle size={14} /> Indice:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {shuffleWords(currentCard.back).map((word, index) => <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{word}</span>)}
                            </div>
                        </div>
                    )}
                    {showAnswer ? (
                        <div className="text-center space-y-2">
                            <div className="text-xl font-semibold text-charcoal">Réponse: {currentCard.back}</div>
                             <div className={`text-lg font-bold flex items-center justify-center gap-2 ${normalizeText(userAnswer) === normalizeText(currentCard.back) ? 'text-italian-green' : 'text-terracotta'}`}>
                                {normalizeText(userAnswer) === normalizeText(currentCard.back) ? <><CheckCircle size={20}/> Correct !</> : <><XCircle size={20}/> Incorrect</>}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button onClick={checkAnswer} className="bg-italian-green hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg" disabled={!userAnswer.trim()}>Vérifier</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};