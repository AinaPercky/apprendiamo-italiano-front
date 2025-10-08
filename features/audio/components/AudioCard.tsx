// src/features/audio/components/AudioCard.tsx

import React from 'react';
import type { AudioItem } from '../../../types';
import { AUDIO_API_BASE, AUDIO_CATEGORIES, AUDIO_LANGUAGES } from '../../../constants';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Edit, Trash2, Play, Pause, Repeat } from 'lucide-react';

/**
 * @file Affiche une carte individuelle pour un élément audio.
 * Gère la lecture, la boucle et les actions (modifier, supprimer).
 */

interface AudioCardProps {
    item: AudioItem;
    onEdit: (item: AudioItem) => void;
    onDelete: (id: number) => void;
}

export const AudioCard: React.FC<AudioCardProps> = ({ item, onEdit, onDelete }) => {
    const { playingAudioId, loopingAudioId, playAudio, toggleLoop } = useAudioPlayer();

    const categoryLabel = AUDIO_CATEGORIES.find(c => c.value === item.category)?.label;
    const languageFlag = AUDIO_LANGUAGES.find(l => l.value === item.language)?.flag;

    return (
        <div className="bg-italian-white border border-gray-200 rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow mb-auto">
            <audio id={`audio-player-${item.id}`} src={`${AUDIO_API_BASE}${item.audio_url}`} preload="auto"></audio>
            <div>
                <div className="flex justify-between items-start">
                    <span className="text-sm bg-olive/10 text-olive-dark font-semibold px-2 py-1 rounded-full">{categoryLabel}</span>
                    <span className="text-lg">{languageFlag}</span>
                </div>
                <h3 className="text-xl font-semibold font-serif my-2 text-charcoal">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 italic">"{item.text}"</p>
                {item.ipa && <p className="text-indigo-700 bg-indigo-100 rounded-md px-2 py-1 text-sm font-mono">API: {item.ipa}</p>}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button onClick={() => playAudio(item.id)} className="text-italian-green hover:text-green-800 p-2 rounded-full hover:bg-green-100">
                        {playingAudioId === item.id ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button
                        onClick={() => toggleLoop(item.id)}
                        title="Lire en boucle"
                        className={`p-2 rounded-full transition-colors ${loopingAudioId === item.id ? 'text-italian-green bg-green-100' : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'}`}
                    >
                        <Repeat size={18} />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onEdit(item)} className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10"><Edit size={18} /></button>
                    <button onClick={() => onDelete(item.id)} className="text-terracotta hover:text-terracotta-dark p-2 rounded-full hover:bg-red-100"><Trash2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};
