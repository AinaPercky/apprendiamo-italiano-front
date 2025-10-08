// src/features/audio/hooks/useAudioLibrary.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
// Fix: Import the shared AudioFilters type.
import type { AudioItem, AudioFormData, AudioCategory, AudioLanguage, AudioFilters } from '../../../types';
import { fetchAudioItems, createAudio, updateAudio, deleteAudio } from '../../../services/audioApi';

/**
 * @file Hook personnalisé pour gérer l'état et la logique de la bibliothèque audio.
 * Encapsule le chargement, le filtrage, la création, la mise à jour et la suppression des audios.
 */

// Fix: Removed local type definition for AudioFilters as it's now imported from types.ts.

export const useAudioLibrary = () => {
    const [audioItems, setAudioItems] = useState<AudioItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<AudioFilters>({
        searchTerm: '',
        category: 'all',
        language: 'all',
    });

    /**
     * Charge la liste complète des audios depuis l'API.
     */
    const loadAudioItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAudioItems();
            setAudioItems(data.sort((a, b) => b.id - a.id)); // Trie par ID décroissant
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Charge les données au premier rendu du hook.
    useEffect(() => {
        loadAudioItems();
    }, [loadAudioItems]);

    /**
     * Filtre les audios en fonction des critères de recherche et des filtres sélectionnés.
     * `useMemo` est utilisé pour ne recalculer la liste que si les dépendances changent.
     */
    const filteredAudioItems = useMemo(() => {
        return audioItems.filter(item => {
            const { searchTerm, category, language } = filters;
            const lowerSearchTerm = searchTerm.toLowerCase();

            const matchesSearch = searchTerm === '' ||
                item.title.toLowerCase().includes(lowerSearchTerm) ||
                item.text.toLowerCase().includes(lowerSearchTerm);
            
            const matchesCategory = category === 'all' || item.category === category;
            const matchesLanguage = language === 'all' || item.language === language;

            return matchesSearch && matchesCategory && matchesLanguage;
        });
    }, [audioItems, filters]);

    // Fonctions CRUD (Create, Read, Update, Delete)

    const createAudioItem = async (formData: AudioFormData) => {
        await createAudio(formData);
        await loadAudioItems(); // Recharge toute la liste pour voir le nouvel item
    };

    const updateAudioItem = async (item: AudioItem, formData: AudioFormData) => {
        await updateAudio(item.id, formData);
        await loadAudioItems(); // Recharge pour voir les modifications
    };

    const deleteAudioItem = async (id: number) => {
        await deleteAudio(id);
        setAudioItems(prev => prev.filter(item => item.id !== id)); // Mise à jour optimiste de l'UI
    };

    return {
        audioItems,
        filteredAudioItems,
        isLoading,
        error,
        filters,
        setFilters,
        createAudioItem,
        updateAudioItem,
        deleteAudioItem,
    };
};
