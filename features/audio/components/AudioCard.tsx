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
    { value: 0.85, label: '0.85x' },
    { value: 0.9, label: '0.9x' },
    { value: 1, label: '1x' },
    { value: 1.1, label: '1.1x' },
    { value: 1.2, label: '1.2x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.3, label: '1.3x' },
    { value: 1.4, label: '1.4x' },
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
            <div className="glass-card border-2 border-transparent rounded-2xl shadow-lg p-6 flex flex-col justify-between card-hover mb-auto hover:border-italian-green/30">
                <audio id={`audio-player-${item.id}`} src={`${AUDIO_API_BASE}${item.audio_url}`} preload="auto"></audio>
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-sm bg-gradient-to-r from-olive to-olive-light text-white font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            {categoryLabel}
                        </span>
                        <span className="text-2xl">{languageFlag}</span>
                    </div>

                    <h3 className="text-2xl font-bold font-serif my-3 text-charcoal">{item.title}</h3>
                    <div className="bg-italian-green/5 border-l-4 border-italian-green rounded-r-xl p-3 mb-3">
                        <p className="text-gray-700 text-base italic">"{item.text}"</p>
                    </div>

                    {item.ipa && (
                        <div className="bg-gradient-to-r from-olive/10 to-olive-light/10 border border-olive/30 rounded-xl px-3 py-2 text-sm font-mono">
                            <span className="text-olive-dark font-semibold">IPA:</span> <span className="text-olive">{item.ipa}</span>
                        </div>
                    )}

                    <button
                        onClick={() => setShowKaraoke(true)}
                        className="mt-4 text-sm bg-italian-green/10 text-italian-green font-semibold px-4 py-2 rounded-full hover:bg-italian-green hover:text-white transition-all duration-200"
                    >
                        🎤 Mode karaoké
                    </button>
                </div>

                <div className="flex items-center justify-between mt-5 pt-5 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => playAudio(item.id)}
                            className="text-white bg-italian-green hover:bg-green-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            title={playingAudioId === item.id ? 'Pause' : 'Lire'}
                        >
                            {playingAudioId === item.id ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <button
                            onClick={() => toggleLoop(item.id)}
                            title="Lire en boucle"
                            className={`p-3 rounded-full transition-all ${
                                loopingAudioId === item.id
                                    ? 'text-white bg-italian-green shadow-md scale-105'
                                    : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                            }`}
                        >
                            <Repeat size={20} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                title="Vitesse de lecture"
                                className={`p-3 rounded-full transition-all ${
                                    showSpeedMenu
                                        ? 'bg-olive/20 text-olive-dark'
                                        : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                                }`}
                            >
                                <Gauge size={20} />
                            </button>

                            {showSpeedMenu && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl py-2 min-w-[90px] z-10">
                                    {SPEED_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSpeedChange(option.value)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-olive/10 transition-colors ${
                                                playbackSpeed === option.value
                                                    ? 'bg-olive/20 font-bold text-olive-dark'
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

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="text-olive hover:text-olive-dark p-2 rounded-full hover:bg-olive/10 transition-all"
                        >
                            <Edit size={20} />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-terracotta hover:text-terracotta-dark p-2 rounded-full hover:bg-red-100 transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {showKaraoke && (
                <AudioKaraokeView
                    item={item}
                    onClose={() => setShowKaraoke(false)}
                />
            )}
        </>
    );
};
