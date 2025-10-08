// src/features/flashcards/components/CardForm.tsx

import React, { useState, useEffect } from 'react';
import { useCards } from '../hooks/useCards';
import type { Card } from '../../../types';
import { ArrowLeft, XCircle, Loader2 } from 'lucide-react';

/**
 * @file Formulaire pour la création ou la modification d'une flashcard.
 * Le formulaire s'adapte en fonction de la présence de `cardToEdit`.
 */

interface CardFormProps {
    deckId: number;
    /** La carte à éditer. Si null, le formulaire est en mode création. */
    cardToEdit?: Card | null;
    /** Fonction à appeler après la soumission réussie ou l'annulation. */
    onFinish: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({ deckId, cardToEdit, onFinish }) => {
    const isEditing = !!cardToEdit;
    const { createCard, updateCard } = useCards(deckId);
    
    const [formData, setFormData] = useState({
        front: '',
        back: '',
        pronunciation: '',
        image: '',
        tags: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pré-remplir le formulaire si on est en mode édition
    useEffect(() => {
        if (isEditing && cardToEdit) {
            setFormData({
                front: cardToEdit.front,
                back: cardToEdit.back,
                pronunciation: cardToEdit.pronunciation || '',
                image: cardToEdit.image || '',
                tags: cardToEdit.tags ? cardToEdit.tags.join(', ') : '',
            });
        }
    }, [isEditing, cardToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({ ...formData, image: e.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Fix: Correctly handle data submission for both create and update scenarios,
    // as they expect different types for the 'tags' property.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            if (isEditing && cardToEdit) {
                // For update, `updateCard` expects `tags` as a string, which `formData` provides.
                await updateCard(cardToEdit.card_pk, formData);
            } else {
                // For create, `createCard` expects `tags` as a string array.
                const cardData = {
                    ...formData,
                    tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                };
                await createCard(cardData);
            }
            onFinish();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={onFinish} className="text-olive hover:text-olive-dark mr-4"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-serif text-charcoal">{isEditing ? 'Modifier la Carte' : 'Nouvelle Carte'}</h1>
            </div>
            <div className="bg-italian-white rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Champs du formulaire */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recto (Français)</label>
                        <input name="front" type="text" value={formData.front} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent" placeholder="Mot ou phrase en français" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verso (Italien)</label>
                        <input name="back" type="text" value={formData.back} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent" placeholder="Traduction en italien" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prononciation (optionnel)</label>
                        <input name="pronunciation" type="text" value={formData.pronunciation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent" placeholder="Phonétique"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image (optionnel)</label>
                        <div className="flex items-center gap-4">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload"/>
                            <label htmlFor="image-upload" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">Choisir une image</label>
                            {formData.image && <button onClick={() => setFormData({ ...formData, image: '' })} className="text-terracotta hover:text-terracotta-dark"><XCircle/></button>}
                        </div>
                        {formData.image && <div className="mt-2 flex justify-center"><img src={formData.image} alt="Preview" className="max-w-32 max-h-32 object-contain rounded-lg bg-gray-50 p-2"/></div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par une virgule)</label>
                        <input name="tags" type="text" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent" placeholder="nourriture, basique, verbe"/>
                    </div>
                     {error && <p className="text-sm text-terracotta">{error}</p>}
                    <button type="submit" disabled={!formData.front.trim() || !formData.back.trim() || isSubmitting} className="w-full bg-italian-green hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors flex justify-center items-center">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (isEditing ? 'Mettre à jour' : 'Créer la Carte')}
                    </button>
                </form>
            </div>
        </div>
    );
};