// src/components/AudioApp.tsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAudioLibrary } from '../features/audio/hooks/useAudioLibrary';

import { AudioFilterBar } from '../features/audio/components/AudioFilterBar';
import { AudioList } from '../features/audio/components/AudioList';
import { AudioFormModal } from '../features/audio/components/AudioFormModal';
import type { AudioItem } from '../types';

/**
 * @file Conteneur principal pour la fonctionnalité de la Bibliothèque Audio.
 * Gère l'état d'ouverture du modal de formulaire et orchestre les
 * sous-composants (barre de filtre, liste, modal).
 */
const AudioApp: React.FC = () => {
    // Hook personnalisé pour gérer la logique de la bibliothèque audio
    const {
        filteredAudioItems,
        isLoading,
        error,
        filters,
        setFilters,
        createAudioItem,
        updateAudioItem,
        deleteAudioItem,
    } = useAudioLibrary();

    // État pour contrôler la visibilité du modal de formulaire
    const [isModalOpen, setIsModalOpen] = useState(false);
    // État pour garder en mémoire l'élément en cours d'édition
    const [editingItem, setEditingItem] = useState<AudioItem | null>(null);

    const handleOpenModal = (item: AudioItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-10">
            {isModalOpen && (
                <AudioFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={editingItem ? updateAudioItem : createAudioItem}
                    itemToEdit={editingItem}
                />
            )}

            <div className="flex justify-between items-center mb-8 flex-wrap gap-4 animate-slide-in">
                <div>
                    <h1 className="text-4xl font-bold font-serif text-charcoal mb-2 flex items-center gap-3">
                        🎵 Bibliothèque Audio
                    </h1>
                    <p className="text-gray-600">Écoutez, apprenez et pratiquez votre prononciation</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 shine-effect"
                >
                    <Plus size={20} /> Créer un Audio
                </button>
            </div>

            <AudioFilterBar filters={filters} onFilterChange={setFilters} />

            <AudioList
                audioItems={filteredAudioItems}
                isLoading={isLoading}
                error={error}
                onEdit={handleOpenModal}
                onDelete={deleteAudioItem}
            />
        </div>
    );
};

export default AudioApp;
