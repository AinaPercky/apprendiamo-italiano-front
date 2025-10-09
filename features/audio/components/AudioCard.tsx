// src/features/audio/components/AudioCard.tsx

import React, { useState } from 'react';
import type { AudioItem } from '../../../types';
import { AUDIO_API_BASE, AUDIO_CATEGORIES, AUDIO_LANGUAGES } from '../../../constants';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { AudioKaraokeView } from './AudioKaraokeView';
import { Edit, Trash2, Play, Pause, Repeat, Gauge } from 'lucide-react';

/**
 * @file Affiche une carte individuelle pour un élément audio.
 * Gère la lecture, la boucle, la vitesse, le mode karaoké et les actions (modifier, supprimer).
 */

interface AudioCardProps {
    item: AudioItem;
    onEdit: (item: AudioItem) => void;
    onDelete: (id: number) => void;
}

const SPEED_OPTIONS = [
    { value: 0.5, label: '0.5x' },
    { value: 0.6, label: '0.6x' },
    { value: 0.65, label: '0.65x' },
    { value: 0.7, label: '0.7x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
];

export const AudioCard: React.FC<AudioCardProps> = ({ item, onEdit, onDelete }) => {
    const { playingAudioId, loopingAudioId, playbackSpeed, playAudio, toggleLoop, changeSpeed } = useAudioPlayer();
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showKaraoke, setShowKaraoke] = useState(false);

    const categoryLabel = AUDIO_CATEGORIES.find(c => c.value === item.category)?.label;
    const languageFlag = AUDIO_LANGUAGES.find(l => l.value === item.language)?.flag;

    const handleSpeedChange = (speed: number) => {
        changeSpeed(speed);
        setShowSpeedMenu(false);
    };

    return (
        <>
            <div className="bg-italian-white border border-gray-200 rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow mb-auto">
                <audio id={`audio-player-${item.id}`} src={`${AUDIO_API_BASE}${item.audio_url}`} preload="auto"></audio>
                <div>
                    <div className="flex justify-between items-start">
                        <span className="text-sm bg-olive/10 text-olive-dark font-semibold px-2 py-1 rounded-full">
                            {categoryLabel}
                        </span>
                        <span className="text-lg">{languageFlag}</span>
                    </div>

                    <h3 className="text-xl font-semibold font-serif my-2 text-charcoal">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 italic">"{item.text}"</p>

                    {item.ipa && (
                        <p className="text-indigo-700 bg-indigo-100 rounded-md px-2 py-1 text-sm font-mono">
                            IPA: {item.ipa}
                        </p>
                    )}

                    {/* Bouton pour ouvrir la vue karaoké */}
                    <button
                        onClick={() => setShowKaraoke(true)}
                        className="mt-3 text-sm text-olive-dark underline hover:text-olive"
                    >
                        Voir en mode karaoké
                    </button>
                </div>

                {/* Contrôles audio */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {/* Lecture / Pause */}
                        <button
                            onClick={() => playAudio(item.id)}
                            className="text-italian-green hover:text-green-800 p-2 rounded-full hover:bg-green-100"
                            title={playingAudioId === item.id ? 'Pause' : 'Lire'}
                        >
                            {playingAudioId === item.id ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        {/* Boucle */}
                        <button
                            onClick={() => toggleLoop(item.id)}
                            title="Lire en boucle"
                            className={`p-2 rounded-full transition-colors ${
                                loopingAudioId === item.id
                                    ? 'text-italian-green bg-green-100'
                                    : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                            }`}
                        >
                            <Repeat size={18} />
                        </button>

                        {/* Vitesse */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                title="Vitesse de lecture"
                                className={`p-2 rounded-full transition-colors ${
                                    showSpeedMenu
                                        ? 'bg-olive/10 text-olive-dark'
                                        : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                                }`}
                            >
                                <Gauge size={18} />
                            </button>

                            {showSpeedMenu && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[80px] z-10">
                                    {SPEED_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSpeedChange(option.value)}
                                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-olive/10 transition-colors ${
                                                playbackSpeed === option.value
                                                    ? 'bg-olive/20 font-semibold text-olive-dark'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions éditer / supprimer */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-terracotta hover:text-terracotta-dark p-2 rounded-full hover:bg-red-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Vue karaoké modale */}
            {showKaraoke && (
                <AudioKaraokeView
                    item={item}
                    onClose={() => setShowKaraoke(false)}
                />
            )}
        </>
    );
};
