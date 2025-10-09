// src/features/audio/components/AudioKaraokeView.tsx

import React, { useEffect, useRef } from 'react';
import type { AudioItem } from '../../../types';
import { AUDIO_API_BASE } from '../../../constants';
import { useKaraoke } from '../hooks/useKaraoke';
import { X, Play, Pause, Repeat, Gauge, Mic } from 'lucide-react';

// NOTE: on n'utilise pas obligatoirement useAudioPlayer ici pour la lecture,
// pour garantir que l'élément audio surveillé est bien celui qui joue.
// Si tu veux l'intégration au player global, je te montre après comment faire.

interface AudioKaraokeViewProps {
    item: AudioItem;
    onClose: () => void;
}

const SPEED_OPTIONS = [
{ value: 0.5, label: '0.5x' },
{ value: 0.6, label: '0.6x' },
{ value: 0.65, label: '0.65x' },
{ value: 0.7, label: '0.7x' },
{ value: 0.75, label: '0.75x' },
{ value: 0.75, label: '0.85x' },
{ value: 0.75, label: '0.9x' },
{ value: 1, label: '1x' },
{ value: 1.25, label: '1.25x' },
{ value: 1.5, label: '1.5x' },
{ value: 2, label: '2x' },
];

export const AudioKaraokeView: React.FC<AudioKaraokeViewProps> = ({ item, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { currentWordIndex, initKaraoke, reset } = useKaraoke();
    const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLooping, setIsLooping] = React.useState(false);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1);

    const words = item.text ? item.text.split(/\s+/) : [];

    // initialiser le karaoké sur l'élément audio du modal
    useEffect(() => {
        if (!audioRef.current) return;
        const cleanup = initKaraoke(audioRef.current, item.text || '');
        return cleanup;
    }, [item.text, initKaraoke]);

    // appliquer la vitesse
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    // handlers locaux de lecture
    const togglePlay = async () => {
        if (!audioRef.current) return;
        try {
            if (audioRef.current.paused) {
                await audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        } catch (err) {
            console.warn('Impossible de lancer la lecture :', err);
        }
    };

    const toggleLooping = () => {
        if (!audioRef.current) return;
        audioRef.current.loop = !audioRef.current.loop;
        setIsLooping(audioRef.current.loop);
    };

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
    };

    // reset au close
    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-italian-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-italian-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif text-charcoal">{item.title}</h2>
                    <button
                        onClick={() => {
                            // stop audio et fermer
                            if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0;
                            }
                            onClose();
                        }}
                        className="text-gray-500 hover:text-charcoal p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <audio
                        ref={audioRef}
                        id={`audio-player-${item.id}`}
                        src={`${AUDIO_API_BASE}${item.audio_url}`}
                        preload="metadata"
                    />

                    {/* Texte karaoké */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-inner">
                        <div className="text-2xl leading-relaxed text-center">
                            {words.map((word, index) => (
                                <span
                                    key={index}
                                    className={`inline-block mx-1 transition-all duration-200 ${
                                        index === currentWordIndex
                                            ? 'text-italian-green font-bold scale-110 bg-green-100 px-2 py-1 rounded'
                                            : index < currentWordIndex
                                            ? 'text-gray-400'
                                            : 'text-charcoal'
                                    }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* IPA */}
                    {item.ipa && (
                        <div className="mb-6 text-center">
                            <p className="text-indigo-700 bg-indigo-100 rounded-md px-4 py-2 inline-block font-mono">
                                IPA: {item.ipa}
                            </p>
                        </div>
                    )}

                    {/* Contrôles */}
                    <div className="flex items-center justify-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <button
                            onClick={togglePlay}
                            className="text-italian-green hover:text-green-800 p-3 rounded-full hover:bg-green-100 transition-colors"
                            title={isPlaying ? 'Pause' : 'Lire'}
                        >
                            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                        </button>

                        <button
                            onClick={toggleLooping}
                            title="Lire en boucle"
                            className={`p-3 rounded-full transition-colors ${
                                isLooping ? 'text-italian-green bg-green-100' : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                            }`}
                        >
                            <Repeat size={24} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                title="Vitesse de lecture"
                                className={`p-3 rounded-full transition-colors ${
                                    showSpeedMenu ? 'bg-olive/10 text-olive-dark' : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                                }`}
                            >
                                <Gauge size={24} />
                            </button>
                            {showSpeedMenu && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[80px] z-10">
                                    {SPEED_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSpeedChange(option.value)}
                                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-olive/10 transition-colors ${
                                                playbackSpeed === option.value ? 'bg-olive/20 font-semibold text-olive-dark' : 'text-gray-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                // activer/désactiver affichage karaoké (ici on laisse toujours visible)
                            }}
                            title="Karaoké"
                            className="p-3 rounded-full text-gray-500 hover:text-charcoal hover:bg-gray-100"
                        >
                            <Mic size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
