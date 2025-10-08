// src/features/audio/components/AudioFormModal.tsx

import React, { useState, useEffect } from 'react';
import type { AudioItem, AudioFormData } from '../../../types';
import { AUDIO_CATEGORIES, AUDIO_LANGUAGES } from '../../../constants';
import { X, Loader2 } from 'lucide-react';

/**
 * @file Affiche un modal avec un formulaire pour créer ou modifier un élément audio.
 */

interface AudioFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: AudioItem, data: AudioFormData) => Promise<void> | ((data: AudioFormData) => Promise<void>);
    itemToEdit?: AudioItem | null;
}

const initialFormData: AudioFormData = {
    title: '',
    text: '',
    category: 'mot',
    language: 'it',
};

export const AudioFormModal: React.FC<AudioFormModalProps> = ({ isOpen, onClose, onSubmit, itemToEdit }) => {
    const [formData, setFormData] = useState<AudioFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!itemToEdit;

    useEffect(() => {
        if (isEditing && itemToEdit) {
            setFormData({
                title: itemToEdit.title,
                text: itemToEdit.text,
                category: itemToEdit.category,
                language: itemToEdit.language,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [itemToEdit, isEditing, isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            if (isEditing && itemToEdit) {
                await (onSubmit as (item: AudioItem, data: AudioFormData) => Promise<void>)(itemToEdit, formData);
            } else {
                await (onSubmit as (data: AudioFormData) => Promise<void>)(formData);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity">
            <div className="bg-off-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-charcoal"><X /></button>
                <h2 className="text-2xl font-bold font-serif mb-6 text-charcoal">{isEditing ? 'Modifier l\'Audio' : 'Créer un Audio'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Texte à convertir</label>
                        <input type="text" name="text" value={formData.text} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre (optionnel)</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent" placeholder="Par défaut, le texte ci-dessus" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white">
                                {AUDIO_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                            <select name="language" value={formData.language} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white">
                                {AUDIO_LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.flag} {lang.label}</option>)}
                            </select>
                        </div>
                    </div>
                    {error && <div className="bg-red-100 border-l-4 border-terracotta text-terracotta-dark p-3 text-sm" role="alert">{error}</div>}
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-charcoal px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="bg-italian-green text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center min-w-[120px]" disabled={isSubmitting || !formData.text.trim()}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : (isEditing ? 'Mettre à jour' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
