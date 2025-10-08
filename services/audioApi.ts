// src/services/audioApi.ts

import { AUDIO_API_BASE } from '../constants';
import type { AudioItem, AudioFormData } from '../types';

/**
 * @file Centralise tous les appels API pour la fonctionnalité de la Bibliothèque Audio.
 */

const API_BASE = AUDIO_API_BASE;

/**
 * Gère les erreurs de réponse de l'API.
 * @param response - L'objet Response de l'API fetch.
 * @throws {Error} Lance une erreur si la réponse n'est pas OK.
 */
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erreur inconnue du serveur' }));
        throw new Error(errorData.detail || `Erreur API: ${response.statusText}`);
    }
     // Gère les réponses vides (ex: DELETE)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return {};
};

/**
 * Récupère tous les éléments audio depuis le serveur.
 * @returns Une promesse résolue avec un tableau d'AudioItem.
 */
export const fetchAudioItems = (): Promise<AudioItem[]> => {
    return fetch(`${API_BASE}/audios/`).then(handleApiResponse);
};

/**
 * Crée un nouvel élément audio.
 * @param formData - Les données du formulaire pour le nouvel audio.
 * @returns Une promesse résolue avec l'AudioItem créé.
 */
export const createAudio = (formData: AudioFormData): Promise<AudioItem> => {
    const data = new FormData();
    data.append('text', formData.text);
    if (formData.title) {
        data.append('title', formData.title);
    }
    data.append('category', formData.category);
    data.append('language', formData.language);

    return fetch(`${API_BASE}/audios/`, {
        method: 'POST',
        body: data,
    }).then(handleApiResponse);
};

/**
 * Met à jour un élément audio existant.
 * @param id - L'ID de l'élément à mettre à jour.
 * @param formData - Les nouvelles données pour l'élément audio.
 * @returns Une promesse résolue avec l'AudioItem mis à jour.
 */
export const updateAudio = (id: number, formData: AudioFormData): Promise<AudioItem> => {
    const data = new FormData();
    data.append('text', formData.text);
    if (formData.title) {
        data.append('title', formData.title);
    }
    data.append('category', formData.category);
    data.append('language', formData.language);
    
    return fetch(`${API_BASE}/audios/${id}`, {
        method: 'PUT',
        body: data,
    }).then(handleApiResponse);
};

/**
 * Supprime un élément audio.
 * @param id - L'ID de l'élément à supprimer.
 * @returns Une promesse résolue lorsque la suppression est terminée.
 */
export const deleteAudio = (id: number): Promise<void> => {
    return fetch(`${API_BASE}/audios/${id}`, { method: 'DELETE' }).then(handleApiResponse);
};
