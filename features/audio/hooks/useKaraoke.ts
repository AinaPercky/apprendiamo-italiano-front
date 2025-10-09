// src/features/audio/hooks/useKaraoke.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export const useKaraoke = () => {
	const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
	const animationFrameRef = useRef<number | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const wordsTimingsRef = useRef<
		{ word: string; startTime: number; endTime: number }[]
	>([]);

	const calculateWordTimings = useCallback(
		(text: string, audioDuration: number) => {
			const words = text.trim().length ? text.split(/\s+/) : [];

			if (
				!audioDuration ||
				isNaN(audioDuration) ||
				audioDuration <= 0 ||
				words.length === 0
			) {
				return [];
			}

			const totalChars = words.reduce((sum, word) => sum + word.length, 0);
			if (totalChars === 0) {
				return [];
			}

			let cumulativeTime = 0;
			return words.map((word) => {
				const wordDuration = (word.length / totalChars) * audioDuration;
				const timing = {
					word,
					startTime: cumulativeTime,
					endTime: cumulativeTime + wordDuration,
				};
				cumulativeTime += wordDuration;
				return timing;
			});
		},
		[]
	);

	const updateCurrentWord = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const currentTime = audio.currentTime;

		// find index
		const idx = wordsTimingsRef.current.findIndex(
			(timing) => currentTime >= timing.startTime && currentTime < timing.endTime
		);

		// si on tombe hors range (ex: début ou fin), idx sera -1 ; on garde -1 dans ce cas
		setCurrentWordIndex(idx);

		// continuer l'animation tant que l'audio est en train de jouer
		if (!audio.paused && !audio.ended) {
			animationFrameRef.current = requestAnimationFrame(updateCurrentWord);
		} else {
			// Ne plus scheduler ; l'event 'play' relancera la boucle.
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		}
	}, []);

	const initKaraoke = useCallback(
		(audioElement: HTMLAudioElement, text: string) => {
			audioRef.current = audioElement;

			const onLoadedMetadata = () => {
				const duration = audioElement.duration;
				wordsTimingsRef.current = calculateWordTimings(text, duration);

				// mettre à jour immédiatement l'index en fonction du temps courant
				const t = audioElement.currentTime || 0;
				const idx = wordsTimingsRef.current.findIndex(
					(timing) => t >= timing.startTime && t < timing.endTime
				);
				setCurrentWordIndex(idx);
			};

			const onPlay = () => {
				// start loop
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
				animationFrameRef.current = requestAnimationFrame(updateCurrentWord);
			};

			const onPauseOrEnded = () => {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
					animationFrameRef.current = null;
				}
			};

			const onTimeUpdate = () => {
				// timeupdate est fiable et appelé régulièrement ; on met à jour l'index ici
				const t = audioElement.currentTime;
				const idx = wordsTimingsRef.current.findIndex(
					(timing) => t >= timing.startTime && t < timing.endTime
				);
				setCurrentWordIndex(idx);
			};

			const onSeeked = onTimeUpdate;

			audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
			audioElement.addEventListener('play', onPlay);
			audioElement.addEventListener('pause', onPauseOrEnded);
			audioElement.addEventListener('ended', onPauseOrEnded);
			audioElement.addEventListener('timeupdate', onTimeUpdate);
			audioElement.addEventListener('seeked', onSeeked);

			// si les métadonnées sont déjà chargées
			if (audioElement.duration && !isNaN(audioElement.duration)) {
				onLoadedMetadata();
			}

			return () => {
				audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
				audioElement.removeEventListener('play', onPlay);
				audioElement.removeEventListener('pause', onPauseOrEnded);
				audioElement.removeEventListener('ended', onPauseOrEnded);
				audioElement.removeEventListener('timeupdate', onTimeUpdate);
				audioElement.removeEventListener('seeked', onSeeked);

				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
					animationFrameRef.current = null;
				}

				audioRef.current = null;
				wordsTimingsRef.current = [];
				setCurrentWordIndex(-1);
			};
		},
		[calculateWordTimings, updateCurrentWord]
	);

	const reset = useCallback(() => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		setCurrentWordIndex(-1);
		wordsTimingsRef.current = [];
		audioRef.current = null;
	}, []);

	// cleanup global on unmount
	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return {
		currentWordIndex,
		initKaraoke,
		reset,
	};
};