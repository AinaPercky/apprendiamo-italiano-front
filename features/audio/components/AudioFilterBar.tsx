// src/features/audio/components/AudioFilterBar.tsx

import React from 'react';
// Fix: Import the shared AudioFilters type.
import type { AudioCategory, AudioLanguage, AudioFilters } from '../../../types';
import { AUDIO_CATEGORIES, AUDIO_LANGUAGES } from '../../../constants';
import { Search } from 'lucide-react';

/**
 * @file Affiche la barre de recherche et les filtres pour la bibliothèque audio.
 */

// Fix: Use the imported AudioFilters type to strongly type the component's props.
interface AudioFilterBarProps {
    filters: AudioFilters;
    onFilterChange: React.Dispatch<React.SetStateAction<AudioFilters>>;
}

export const AudioFilterBar: React.FC<AudioFilterBarProps> = ({ filters, onFilterChange }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="bg-italian-white p-4 rounded-lg shadow-sm mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <label htmlFor="search-audio" className="sr-only">Rechercher</label>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        id="search-audio"
                        name="searchTerm"
                        placeholder="Rechercher par titre ou texte..."
                        value={filters.searchTerm}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="category-filter" className="sr-only">Catégorie</label>
                    <select
                        id="category-filter"
                        name="category"
                        value={filters.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
                    >
                        <option value="all">Toutes les catégories</option>
                        {AUDIO_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="language-filter" className="sr-only">Langue</label>
                    <select
                        id="language-filter"
                        name="language"
                        value={filters.language}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
                    >
                        <option value="all">Toutes les langues</option>
                        {AUDIO_LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.flag} {lang.label}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};
