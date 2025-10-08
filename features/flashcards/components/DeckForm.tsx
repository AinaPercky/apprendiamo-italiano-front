// src/features/flashcards/components/DeckForm.tsx

import React, { useState } from 'react';
import { useDecks } from '../hooks/useDecks';
import { ArrowLeft, Loader2 } from 'lucide-react';

/**
 * @file Formulaire pour la création d'un nouveau deck.
 */

interface DeckFormProps {
    /** Fonction à appeler une fois le deck créé (ou l'opération annulée). */
    onFinish: () => void;
}

export const DeckForm: React.FC<DeckFormProps> = ({ onFinish }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { createDeck } = useDecks();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await createDeck(name);
            onFinish(); // Revenir à la liste des decks après succès
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={onFinish} className="text-olive hover:text-olive-dark mr-4"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-serif text-charcoal">Nouveau Deck</h1>
            </div>
            <div className="bg-italian-white rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-2">Nom du Deck</label>
                        <input
                            id="deckName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                            placeholder="Entrez le nom du deck"
                            required
                        />
                    </div>
                     {error && <p className="text-sm text-terracotta">{error}</p>}
                    <button
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="w-full bg-italian-green hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Créer le Deck'}
                    </button>
                </form>
            </div>
        </div>
    );
};
