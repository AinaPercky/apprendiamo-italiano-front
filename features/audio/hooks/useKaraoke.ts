// // src/features/audio/hooks/useKaraoke.ts
// import { useState, useCallback, useRef, useEffect } from 'react';

// export const useKaraoke = () => {
//     const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
//     const animationFrameRef = useRef<number | null>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const wordsTimingsRef = useRef<{ word: string; startTime: number; endTime: number }[]>([]);

//     const calculateWordTimings = useCallback((text: string, audioDuration: number) => {
//         const words = text.trim().length ? text.split(/\s+/) : [];
//         if (!audioDuration || isNaN(audioDuration) || audioDuration <= 0 || words.length === 0) {
//             return [];
//         }
//         const timePerWord = audioDuration / words.length;
//         return words.map((word, index) => ({
//             word,
//             startTime: index * timePerWord,
//             endTime: (index + 1) * timePerWord,
//         }));
//     }, []);

//     const updateCurrentWord = useCallback(() => {
//         const audio = audioRef.current;
//         if (!audio) return;

//         const currentTime = audio.currentTime;
//         // find index
//         const idx = wordsTimingsRef.current.findIndex(
//             (timing) => currentTime >= timing.startTime && currentTime < timing.endTime
//         );

//         // si on tombe hors range (ex: début ou fin), idx sera -1 ; on garde -1 dans ce cas
//         setCurrentWordIndex(idx);

//         // continuer l'animation tant que l'audio est en train de jouer
//         if (!audio.paused && !audio.ended) {
//             animationFrameRef.current = requestAnimationFrame(updateCurrentWord);
//         } else {
//             // Ne plus scheduler ; l'event 'play' relancera la boucle.
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//                 animationFrameRef.current = null;
//             }
//         }
//     }, []);

//     const initKaraoke = useCallback((audioElement: HTMLAudioElement, text: string) => {
//         audioRef.current = audioElement;

//         const onLoadedMetadata = () => {
//             const duration = audioElement.duration;
//             wordsTimingsRef.current = calculateWordTimings(text, duration);
//             // mettre à jour immédiatement l'index en fonction du temps courant
//             const t = audioElement.currentTime || 0;
//             const idx = wordsTimingsRef.current.findIndex(
//                 (timing) => t >= timing.startTime && t < timing.endTime
//             );
//             setCurrentWordIndex(idx);
//         };

//         const onPlay = () => {
//             // start loop
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//             }
//             animationFrameRef.current = requestAnimationFrame(updateCurrentWord);
//         };

//         const onPauseOrEnded = () => {
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//                 animationFrameRef.current = null;
//             }
//         };

//         const onTimeUpdate = () => {
//             // timeupdate est fiable et appelé régulièrement ; on met à jour l'index ici
//             const t = audioElement.currentTime;
//             const idx = wordsTimingsRef.current.findIndex(
//                 (timing) => t >= timing.startTime && t < timing.endTime
//             );
//             setCurrentWordIndex(idx);
//         };

//         const onSeeked = onTimeUpdate;

//         audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
//         audioElement.addEventListener('play', onPlay);
//         audioElement.addEventListener('pause', onPauseOrEnded);
//         audioElement.addEventListener('ended', onPauseOrEnded);
//         audioElement.addEventListener('timeupdate', onTimeUpdate);
//         audioElement.addEventListener('seeked', onSeeked);

//         // si les métadonnées sont déjà chargées
//         if (audioElement.duration && !isNaN(audioElement.duration)) {
//             onLoadedMetadata();
//         }

//         return () => {
//             audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
//             audioElement.removeEventListener('play', onPlay);
//             audioElement.removeEventListener('pause', onPauseOrEnded);
//             audioElement.removeEventListener('ended', onPauseOrEnded);
//             audioElement.removeEventListener('timeupdate', onTimeUpdate);
//             audioElement.removeEventListener('seeked', onSeeked);
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//                 animationFrameRef.current = null;
//             }
//             audioRef.current = null;
//             wordsTimingsRef.current = [];
//             setCurrentWordIndex(-1);
//         };
//     }, [calculateWordTimings, updateCurrentWord]);

//     const reset = useCallback(() => {
//         if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current);
//             animationFrameRef.current = null;
//         }
//         setCurrentWordIndex(-1);
//         wordsTimingsRef.current = [];
//         audioRef.current = null;
//     }, []);

//     // cleanup global on unmount
//     useEffect(() => {
//         return () => {
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//             }
//         };
//     }, []);

//     return {
//         currentWordIndex,
//         initKaraoke,
//         reset,
//     };
// };

// src/features/audio/hooks/useKaraoke.ts
import { useState, useCallback, useRef, useEffect } from 'react';

// Définition de type pour les timings (pour la clarté)
interface WordTiming {
    word: string;
    startTime: number;
    endTime: number;
}

export const useKaraoke = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
    // Supprime animationFrameRef car on utilise uniquement 'timeupdate'

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const wordsTimingsRef = useRef<WordTiming[]>([]);

    /**
     * Calcule le timing approximatif de chaque mot par division égale.
     * Cette fonction reste la même car sans données de synchronisation externes,
     * la division égale est la seule approximation possible.
     */
    const calculateWordTimings = useCallback((text: string, audioDuration: number): WordTiming[] => {
        const words = text.trim().length ? text.split(/\s+/) : [];
        if (!audioDuration || isNaN(audioDuration) || audioDuration <= 0 || words.length === 0) {
            return [];
        }
        
        // La méthode la plus simple: durée totale divisée par le nombre de mots.
        // C'est la source de l'imprécision, mais c'est l'hypothèse de base sans timing précis.
        const timePerWord = audioDuration / words.length; 
        
        return words.map((word, index) => ({
            word,
            // Pour donner une petite avance (optionnel mais peut aider l'illusion)
            startTime: index * timePerWord,
            endTime: (index + 1) * timePerWord,
        }));
    }, []);

    /**
     * Gestionnaire pour l'événement 'timeupdate': met à jour l'index du mot courant.
     * C'est la méthode de synchronisation principale.
     */
    const updateCurrentWordOnTimeUpdate = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const currentTime = audio.currentTime;
        
        // Trouve l'index du mot en cours de prononciation
        const idx = wordsTimingsRef.current.findIndex(
            (timing) => currentTime >= timing.startTime && currentTime < timing.endTime
        );
        
        // Met à jour l'état si l'index a changé
        // Utiliser une fonction de mise à jour préventive (prevIdx) pour éviter des mises à jour inutiles
        setCurrentWordIndex(prevIdx => (prevIdx !== idx ? idx : prevIdx));
    }, []);


    const initKaraoke = useCallback((audioElement: HTMLAudioElement, text: string) => {
        audioRef.current = audioElement;

        const onLoadedMetadata = () => {
            const duration = audioElement.duration;
            wordsTimingsRef.current = calculateWordTimings(text, duration);
            // On met à jour l'index initial après le chargement des timings
            updateCurrentWordOnTimeUpdate();
        };

        // On écoute 'timeupdate' pour la synchronisation, et 'seeked' pour le saut
        audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
        audioElement.addEventListener('timeupdate', updateCurrentWordOnTimeUpdate);
        audioElement.addEventListener('seeked', updateCurrentWordOnTimeUpdate);
        
        // *** Pas besoin d'écouter 'play', 'pause' ou 'ended' si on utilise seulement 'timeupdate' ***
        // L'événement 'timeupdate' cesse d'être émis lorsque l'audio est en pause ou terminé.

        // si les métadonnées sont déjà chargées
        if (audioElement.duration && !isNaN(audioElement.duration)) {
            onLoadedMetadata();
        }

        return () => {
            audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
            audioElement.removeEventListener('timeupdate', updateCurrentWordOnTimeUpdate);
            audioElement.removeEventListener('seeked', updateCurrentWordOnTimeUpdate);
            
            // Nettoyage des références
            audioRef.current = null;
            wordsTimingsRef.current = [];
            setCurrentWordIndex(-1);
        };
    }, [calculateWordTimings, updateCurrentWordOnTimeUpdate]);

    const reset = useCallback(() => {
        setCurrentWordIndex(-1);
        wordsTimingsRef.current = [];
        audioRef.current = null;
    }, []);

    // Cleanup global on unmount
    useEffect(() => {
        return () => {
           reset(); // Assure que le state est nettoyé si le hook est démonté
        };
    }, [reset]);

    return {
        currentWordIndex,
        initKaraoke,
        reset,
    };
};