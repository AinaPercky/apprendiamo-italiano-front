// src/features/audio/components/AudioList.tsx

import React from 'react';
import type { AudioItem } from '../../../types';
import { AudioCard } from './AudioCard';
import { Loader2, Volume2, Search } from 'lucide-react';

/**
 * @file Affiche la grille des éléments audio.
 * Gère les états de chargement, d'erreur et de liste vide.
 */

interface AudioListProps {
    audioItems: AudioItem[];
    isLoading: boolean;
    error: string | null;
    onEdit: (item: AudioItem) => void;
    onDelete: (id: number) => void;
}

export const AudioList: React.FC<AudioListProps> = ({ audioItems, isLoading, error, onEdit, onDelete }) => {
    
    if (isLoading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-italian-green" /></div>;
    }

    if (error) {
        return <div className="text-center py-16 bg-red-100 text-terracotta-dark rounded-lg shadow">{error}</div>;
    }

    if (audioItems.length === 0) {
        return (
            <div className="text-center py-16 bg-italian-white rounded-lg shadow">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-charcoal">Aucun résultat</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun fichier audio ne correspond à vos critères de recherche.</p>
            </div>
        );
    }
    
    // Si la liste n'est pas filtrée et est vide (cas initial)
    // Note: cette logique pourrait être améliorée en comparant avec la liste totale
    // if (audioItems.length === 0 && !isLoading) {
    //      return (
    //         <div className="text-center py-16 bg-italian-white rounded-lg shadow">
    //             <Volume2 className="mx-auto h-12 w-12 text-gray-400" />
    //             <h3 className="mt-2 text-sm font-medium text-charcoal">Aucun fichier audio</h3>
    //             <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouveau fichier audio.</p>
    //         </div>
    //     );
    // }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioItems.map(item => (
                <AudioCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
