// src/utils/textUtils.ts

/**
 * @file Contient des fonctions utilitaires pour la manipulation de chaînes de caractères.
 */

/**
 * Normalise un texte en le passant en minuscules, en retirant les accents
 * et en supprimant la ponctuation courante.
 * Utile pour les comparaisons insensibles à la casse et aux accents.
 * @param text - La chaîne de caractères à normaliser.
 * @returns La chaîne de caractères normalisée.
 */
export const normalizeText = (text: string): string => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD') // Sépare les caractères de base et les accents
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques (accents)
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''); // Supprime la ponctuation
};
