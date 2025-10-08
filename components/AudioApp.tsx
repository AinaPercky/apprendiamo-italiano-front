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
        <div className="container mx-auto px-4 py-8">
            {isModalOpen && (
                <AudioFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={editingItem ? updateAudioItem : createAudioItem}
                    itemToEdit={editingItem}
                />
            )}

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold font-serif text-charcoal">Bibliothèque Audio</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-italian-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Créer un Audio
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
