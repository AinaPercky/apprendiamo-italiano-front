// src/features/audio/hooks/useAudioPlayer.ts

import { useState, useCallback } from 'react';

/**
 * @file Hook personnalisé pour gérer la logique du lecteur audio.
 * Gère l'état de lecture (play/pause) et de boucle pour plusieurs éléments audio.
 */
export const useAudioPlayer = () => {
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const [loopingAudioId, setLoopingAudioId] = useState<number | null>(null);

    /**
     * Obtient l'élément audio HTML par son ID.
     * @param id - L'ID de l'élément audio.
     * @returns L'élément HTMLAudioElement ou null.
     */
    const getAudioElement = (id: number) => {
        return document.getElementById(`audio-player-${id}`) as HTMLAudioElement | null;
    };

    /**
     * Gère la lecture/pause d'un fichier audio.
     */
    const playAudio = useCallback((id: number) => {
        const audio = getAudioElement(id);
        if (!audio) return;

        // Si l'audio cliqué est déjà en lecture, on le met en pause.
        if (playingAudioId === id) {
            audio.pause();
            setPlayingAudioId(null);
        } else {
            // Met en pause tous les autres audios avant de lancer le nouveau.
            document.querySelectorAll('audio').forEach(a => a.pause());
            
            setPlayingAudioId(id);
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Erreur de lecture audio:", e));
            
            // Écouteur pour réinitialiser l'état si l'audio est mis en pause par l'utilisateur ou se termine.
            audio.onpause = () => {
                if (audio.paused && !audio.loop) {
                    setPlayingAudioId(null);
                }
            };
        }
    }, [playingAudioId]);

    /**
     * Active/désactive la lecture en boucle pour un fichier audio.
     */
    const toggleLoop = useCallback((id: number) => {
        // Désactive la boucle sur l'ancien audio si on en active un nouveau.
        if (loopingAudioId && loopingAudioId !== id) {
            const oldAudio = getAudioElement(loopingAudioId);
            if (oldAudio) oldAudio.loop = false;
        }

        const audio = getAudioElement(id);
        if (!audio) return;

        // Inverse l'état de la boucle pour l'audio actuel.
        if (loopingAudioId === id) {
            audio.loop = false;
            setLoopingAudioId(null);
        } else {
            audio.loop = true;
            setLoopingAudioId(id);
        }
    }, [loopingAudioId]);

    return {
        playingAudioId,
        loopingAudioId,
        playAudio,
        toggleLoop,
    };
};
