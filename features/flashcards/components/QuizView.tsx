// src/features/flashcards/components/QuizView.tsx

import React from 'react';
import type { Deck } from '../../../types';
import { useCards } from '../hooks/useCards';
import { useQuiz } from '../hooks/useQuiz';
import { Loader2, ArrowLeft, RefreshCw, CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { normalizeText } from '../../../utils/textUtils';

/**
 * @file Affiche l'interface du quiz, que ce soit en mode "typing", "matching", "multiple-choice" ou "until-perfect".
 * Utilise le `useQuiz` hook pour gérer la logique complexe du jeu.
 */

interface QuizViewProps {
    deck: Deck;
    quizType: 'typing' | 'matching' | 'multiple-choice' | 'until-perfect';
    onReturnToCards: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ deck, quizType, onReturnToCards }) => {
    const { cards, isLoading: isLoadingCards } = useCards(deck.deck_pk);
    const {
        score,
        isComplete,
        currentCard,
        userInput,
        setUserInput,
        showAnswer,
        checkAnswer,
        quizCards,
        pendingCards,
        currentIndex,
        options,
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
            <div className="max-w-md mx-auto glass-card rounded-3xl shadow-2xl p-10 text-center border-2 border-italian-green/30 animate-fade-in">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold font-serif text-charcoal mb-6">Bravo ! Quiz Terminé !</h2>
                <div className="text-6xl font-bold text-italian-green mb-4">{score.correct}/{score.total}</div>
                <div className="progress-bar mb-4">
                    <div className="progress-fill" style={{ width: `${finalScore}%` }}></div>
                </div>
                <p className="text-2xl text-gray-700 mb-8 font-semibold">Score: {finalScore}%</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => window.location.reload()} className="btn-primary text-white px-8 py-3 rounded-full flex items-center gap-2 shine-effect"><RefreshCw size={20} /> Recommencer</button>
                    <button onClick={onReturnToCards} className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full transition-all hover:shadow-lg">Retour</button>
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
            <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
                <div className="flex justify-between items-center glass-card p-5 rounded-2xl border-2 border-italian-green/20 shadow-lg">
                    <button onClick={onReturnToCards} className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10 transition-all"><ArrowLeft size={24} /></button>
                    <h2 className="text-3xl font-bold font-serif text-charcoal">🎯 Quiz d'Association</h2>
                    <div className="badge-italian text-lg">Score: {score.correct}/{score.total}</div>
                </div>
                <div className="glass-card rounded-2xl shadow-xl p-8 border-2 border-gray-200">
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
    
    // Quiz "Typing", "Multiple-Choice" ou "Until-Perfect"
    if (!currentCard) return null;

    const isTypingOrUntil = quizType === 'typing' || quizType === 'until-perfect';
    const isMultipleChoice = quizType === 'multiple-choice';

    const progressLabel = quizType === 'until-perfect' 
        ? `Progression ronde: ${currentIndex + 1} / ${pendingCards.length} (Maîtrisées: ${score.correct}/${score.total})`
        : `${currentIndex + 1} / ${quizType === 'until-perfect' ? pendingCards.length : quizCards.length}`;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
            <div className="flex justify-between items-center glass-card p-4 rounded-2xl shadow-lg border-2 border-gray-200">
                <button onClick={onReturnToCards} className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10 transition-all"><ArrowLeft size={24} /></button>
                <div className="text-lg font-semibold text-charcoal">{progressLabel}</div>
                <div className="badge-italian text-base">Score: {score.correct}/{score.total}</div>
            </div>
            <div className="glass-card rounded-2xl shadow-xl p-10 border-2 border-transparent hover:border-italian-green/20 transition-all">
                {currentCard.image && <div className="mb-6 flex justify-center"><img src={currentCard.image} alt="Card" className="max-w-full max-h-80 object-contain rounded-lg bg-gray-50 p-4" /></div>}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold font-serif text-charcoal mb-3">{currentCard.front}</h2>
                    {currentCard.pronunciation && <p className="text-olive text-lg bg-olive/10 px-4 py-2 rounded-full inline-block">{currentCard.pronunciation}</p>}
                </div>
                <div className="space-y-4">
                    {isTypingOrUntil ? (
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Votre réponse en italien..."
                                className="w-full max-w-md px-6 py-4 border-2 border-gray-300 rounded-2xl text-center text-xl font-medium transition-all duration-200 hover:border-italian-green/50"
                                onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
                                disabled={showAnswer}
                            />
                        </div>
                    ) : isMultipleChoice ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !showAnswer && setUserInput(opt)}
                                    className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer font-semibold text-lg ${userInput === opt ? 'bg-olive/20 border-olive text-charcoal shadow-md' : 'border-gray-300 text-charcoal'} ${showAnswer ? (normalizeText(opt) === normalizeText(currentCard.back) ? 'bg-green-100 border-italian-green text-green-800 shadow-lg' : (userInput === opt ? 'bg-red-100 border-terracotta text-red-800' : '')) : 'hover:bg-gray-50 hover:shadow-md'}`}
                                    disabled={showAnswer}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : null}
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
                            <div className={`text-lg font-bold flex items-center justify-center gap-2 ${normalizeText(userInput) === normalizeText(currentCard.back) ? 'text-italian-green' : 'text-terracotta'}`}>
                                {normalizeText(userInput) === normalizeText(currentCard.back) ? <><CheckCircle size={20}/> Correct !</> : <><XCircle size={20}/> Incorrect</>}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button onClick={checkAnswer} className="btn-primary text-white px-10 py-4 rounded-full text-xl shine-effect shadow-xl hover:scale-105 transition-transform" disabled={!userInput.trim()}>Vérifier</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};