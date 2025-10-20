// // src/features/flashcards/components/CardImport.tsx

// import React, { useState } from 'react';
// import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
// import Papa from 'papaparse';
// import { FLASHCARDS_API_BASE } from '../../../constants';

// interface CardImportProps {
//     deckId: number;
//     onImportComplete: (successCount: number) => void;
//     onClose: () => void;
// }

// interface ImportCard {
//     front: string;
//     back: string;
//     pronunciation?: string;
//     image?: string;
//     tags?: string[] | string;
// }

// interface ImportResult {
//     success: number;
//     failed: number;
//     errors: string[];
// }

// export const CardImport: React.FC<CardImportProps> = ({ deckId, onImportComplete, onClose }) => {
//     const [file, setFile] = useState<File | null>(null);
//     const [isImporting, setIsImporting] = useState(false);
//     const [result, setResult] = useState<ImportResult | null>(null);
//     const [preview, setPreview] = useState<ImportCard[]>([]);
//     const [error, setError] = useState<string | null>(null);

//     // Fonction utilitaire pour détecter si une chaîne est un emoji
//     const isEmoji = (str: string): boolean => {
//         if (!str || str.length === 0) return false;
//         const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
//         return emojiRegex.test(str.trim()) || (str.length <= 4 && /[\u{1F000}-\u{1FAFF}]/u.test(str));
//     };

//     // Fonction pour télécharger les exemples
//     const downloadExample = (format: 'json' | 'csv') => {
//         const exampleJSON = [
//             { front: "Bonjour", back: "Ciao", pronunciation: "tʃaʊ", image: "👋", tags: ["salutation", "basique"] },
//             { front: "Merci", back: "Grazie", pronunciation: "ˈɡrattsje", image: "🙏", tags: ["politesse", "basique"] },
//             { front: "Au revoir", back: "Arrivederci", pronunciation: "arriːveˈdertʃi", tags: ["salutation"] },
//             { front: "Oui", back: "Sì", pronunciation: "si", image: "✅", tags: ["basique"] },
//             { front: "Non", back: "No", pronunciation: "nɔ", image: "❌", tags: ["basique"] },
//             { front: "Un café", back: "Un caffè", pronunciation: "un kafˈfɛ", image: "☕", tags: ["nourriture", "boisson"] },
//             { front: "Le chat", back: "Il gatto", pronunciation: "il ˈɡatto", image: "🐱", tags: ["animaux"] },
//             { front: "La maison", back: "La casa", pronunciation: "la ˈkaːza", image: "🏠", tags: ["lieu"] },
//             { front: "Comment allez-vous?", back: "Come sta?", tags: ["question", "salutation"] },
//             { front: "Combien?", back: "Quanto?", pronunciation: "ˈkwanto", tags: ["question"] }
//         ];

//         const exampleCSV = `front,back,pronunciation,image,tags
// Bonjour,Ciao,tʃaʊ,👋,salutation;basique
// Merci,Grazie,ˈɡrattsje,🙏,politesse;basique
// Au revoir,Arrivederci,arriːveˈdertʃi,,salutation
// Oui,Sì,si,✅,basique
// Non,No,nɔ,❌,basique
// Un café,Un caffè,un kafˈfɛ,☕,nourriture;boisson
// Le chat,Il gatto,il ˈɡatto,🐱,animaux
// La maison,La casa,la ˈkaːza,🏠,lieu
// Comment allez-vous?,Come sta?,,😊,question;salutation
// Combien?,Quanto?,ˈkwanto,,question`;

//         let content: string;
//         let filename: string;
//         let mimeType: string;

//         if (format === 'json') {
//             content = JSON.stringify(exampleJSON, null, 2);
//             filename = 'exemple_flashcards.json';
//             mimeType = 'application/json';
//         } else {
//             content = exampleCSV;
//             filename = 'exemple_flashcards.csv';
//             mimeType = 'text/csv;charset=utf-8;';
//         }

//         const blob = new Blob([content], { type: mimeType });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = event.target.files?.[0];
//         if (!selectedFile) return;

//         setFile(selectedFile);
//         setError(null);
//         setResult(null);

//         try {
//             const cards = await parseFile(selectedFile);
//             setPreview(cards.slice(0, 5));
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier');
//             setFile(null);
//         }
//     };

//     const parseFile = async (file: File): Promise<ImportCard[]> => {
//         const extension = file.name.split('.').pop()?.toLowerCase();

//         if (extension === 'json') {
//             return parseJSON(file);
//         } else if (extension === 'csv') {
//             return parseCSV(file);
//         } else {
//             throw new Error('Format de fichier non supporté. Utilisez JSON ou CSV.');
//         }
//     };

//     const parseJSON = async (file: File): Promise<ImportCard[]> => {
//         const text = await file.text();
//         const data = JSON.parse(text);

//         if (!Array.isArray(data)) {
//             throw new Error('Le fichier JSON doit contenir un tableau de cartes');
//         }

//         return data.map((card, index) => {
//             if (!card.front || !card.back) {
//                 throw new Error(`Carte ${index + 1}: les champs "front" et "back" sont obligatoires`);
//             }
            
//             const imageValue = card.image !== undefined && card.image !== null ? String(card.image).trim() : '';
            
//             return {
//                 front: String(card.front).trim(),
//                 back: String(card.back).trim(),
//                 pronunciation: card.pronunciation ? String(card.pronunciation).trim() : '',
//                 image: imageValue,
//                 tags: Array.isArray(card.tags) ? card.tags : []
//             };
//         });
//     };

//     const parseCSV = async (file: File): Promise<ImportCard[]> => {
//         return new Promise((resolve, reject) => {
//             Papa.parse(file, {
//                 header: true,
//                 skipEmptyLines: true,
//                 dynamicTyping: false,
//                 delimitersToGuess: [',', ';', '\t'],
//                 complete: (results) => {
//                     try {
//                         const cards = results.data.map((row: any, index: number) => {
//                             const cleanRow: any = {};
//                             Object.keys(row).forEach(key => {
//                                 cleanRow[key.trim()] = row[key];
//                             });

//                             if (!cleanRow.front || !cleanRow.back) {
//                                 throw new Error(`Ligne ${index + 2}: les colonnes "front" et "back" sont obligatoires`);
//                             }

//                             return {
//                                 front: cleanRow.front.trim(),
//                                 back: cleanRow.back.trim(),
//                                 pronunciation: cleanRow.pronunciation?.trim() || '',
//                                 image: cleanRow.image?.trim() || '',
//                                 tags: cleanRow.tags 
//                                     ? cleanRow.tags.split(';').map((t: string) => t.trim()).filter(Boolean)
//                                     : []
//                             };
//                         });
//                         resolve(cards);
//                     } catch (err) {
//                         reject(err);
//                     }
//                 },
//                 error: (error) => {
//                     reject(new Error(`Erreur de parsing CSV: ${error.message}`));
//                 }
//             });
//         });
//     };

//     const handleImport = async () => {
//         if (!file) return;

//         setIsImporting(true);
//         setError(null);

//         try {
//             const cards = await parseFile(file);
//             const errors: string[] = [];
//             let successCount = 0;

//             for (let i = 0; i < cards.length; i++) {
//                 try {
//                     await createCard(cards[i]);
//                     successCount++;
//                 } catch (err) {
//                     errors.push(`Carte ${i + 1} (${cards[i].front}): ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
//                 }
//             }

//             setResult({
//                 success: successCount,
//                 failed: errors.length,
//                 errors
//             });

//             if (successCount > 0) {
//                 setTimeout(() => {
//                     onImportComplete(successCount);
//                 }, 2000);
//             }
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
//         } finally {
//             setIsImporting(false);
//         }
//     };

//     const createCard = async (cardData: ImportCard) => {
//         const payload = {
//             deck_pk: deckId,
//             front: cardData.front,
//             back: cardData.back,
//             pronunciation: cardData.pronunciation || '',
//             image: cardData.image || '',
//             tags: Array.isArray(cardData.tags) ? cardData.tags : [],
//             created_at: new Date().toISOString(),
//             next_review: new Date().toISOString()
//         };

//         const response = await fetch(`${FLASHCARDS_API_BASE}/cards/`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({ detail: 'Erreur serveur' }));
//             throw new Error(errorData.detail || 'Échec de création');
//         }

//         return response.json();
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//             <div className="bg-italian-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <div className="sticky top-0 bg-italian-white border-b border-gray-200 p-6 flex justify-between items-center">
//                     <h2 className="text-2xl font-bold font-serif text-charcoal">Importer des cartes</h2>
//                     <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <div className="p-6 space-y-6">
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                         <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
//                             <FileText size={18} />
//                             Formats acceptés
//                         </h3>
//                         <ul className="text-sm text-blue-800 space-y-1.5">
//                             <li>• <strong>Obligatoire:</strong> front, back</li>
//                             <li>• <strong>Optionnel:</strong> pronunciation, image, tags</li>
//                         </ul>
//                         <div className="mt-3 pt-3 border-t border-blue-200">
//                             <p className="text-sm text-blue-900 font-medium mb-1.5">📸 Images (optionnelles):</p>
//                             <ul className="text-xs text-blue-700 space-y-1">
//                                 <li>• <strong>Emojis</strong>: 👋 🙏 ☕ 🏠 (recommandé)</li>
//                                 <li>• <strong>URLs</strong>: https://example.com/image.jpg</li>
//                                 <li>• <strong>Base64</strong>: data:image/png;base64,...</li>
//                                 <li>• <strong>Sans image</strong>: Laissez vide ou omettez le champ</li>
//                             </ul>
//                         </div>
//                         <div className="mt-3 pt-3 border-t border-blue-200 flex gap-3 justify-center">
//                             <button
//                                 onClick={() => downloadExample('json')}
//                                 className="text-xs text-olive hover:text-olive-dark underline flex items-center gap-1"
//                             >
//                                 <Download size={12} />
//                                 Télécharger exemple JSON
//                             </button>
//                             <button
//                                 onClick={() => downloadExample('csv')}
//                                 className="text-xs text-olive hover:text-olive-dark underline flex items-center gap-1"
//                             >
//                                 <Download size={12} />
//                                 Télécharger exemple CSV
//                             </button>
//                         </div>
//                     </div>

//                     {!file && !result && (
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-olive transition-colors">
//                             <input
//                                 type="file"
//                                 accept=".json,.csv"
//                                 onChange={handleFileSelect}
//                                 className="hidden"
//                                 id="file-upload"
//                             />
//                             <label htmlFor="file-upload" className="cursor-pointer">
//                                 <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                                 <p className="text-gray-600">Cliquez pour sélectionner un fichier</p>
//                                 <p className="text-sm text-gray-400 mt-2">JSON ou CSV</p>
//                             </label>
//                         </div>
//                     )}

//                     {file && !result && preview.length > 0 && (
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <FileText className="text-olive" size={20} />
//                                     <span className="font-medium">{file.name}</span>
//                                     <span className="text-sm text-gray-500">({preview.length}+ cartes détectées)</span>
//                                 </div>
//                                 <button
//                                     onClick={() => {
//                                         setFile(null);
//                                         setPreview([]);
//                                     }}
//                                     className="text-terracotta hover:text-terracotta-dark"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>

//                             <div className="bg-gray-50 rounded-lg p-4">
//                                 <h4 className="font-semibold mb-3 text-gray-700">Aperçu (5 premières cartes)</h4>
//                                 <div className="space-y-3">
//                                     {preview.map((card, index) => (
//                                         <div key={index} className="bg-white rounded border border-gray-200 p-4 flex gap-3">
//                                             {card.image && (
//                                                 <div className="flex-shrink-0">
//                                                     {isEmoji(card.image) ? (
//                                                         <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
//                                                             {card.image}
//                                                         </div>
//                                                     ) : (
//                                                         <img 
//                                                             src={card.image} 
//                                                             alt={card.front}
//                                                             className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1"
//                                                             onError={(e) => {
//                                                                 e.currentTarget.style.display = 'none';
//                                                             }}
//                                                         />
//                                                     )}
//                                                 </div>
//                                             )}
                                            
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="grid grid-cols-2 gap-2 text-sm">
//                                                     <div className="truncate">
//                                                         <span className="text-gray-500 font-medium">Front:</span> {card.front}
//                                                     </div>
//                                                     <div className="truncate">
//                                                         <span className="text-gray-500 font-medium">Back:</span> {card.back}
//                                                     </div>
//                                                 </div>
//                                                 {card.pronunciation && (
//                                                     <div className="text-xs text-olive mt-1 flex items-center gap-1">
//                                                         <span className="font-medium">IPA:</span> {card.pronunciation}
//                                                     </div>
//                                                 )}
//                                                 {card.tags && Array.isArray(card.tags) && card.tags.length > 0 && (
//                                                     <div className="flex flex-wrap gap-1 mt-2">
//                                                         {card.tags.slice(0, 3).map((tag, tagIndex) => (
//                                                             <span key={tagIndex} className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
//                                                                 {tag}
//                                                             </span>
//                                                         ))}
//                                                         {card.tags.length > 3 && (
//                                                             <span className="text-gray-400 text-xs">+{card.tags.length - 3}</span>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleImport}
//                                 disabled={isImporting}
//                                 className="w-full bg-italian-green hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
//                             >
//                                 {isImporting ? (
//                                     <>
//                                         <Loader2 className="animate-spin" size={20} />
//                                         Import en cours...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Upload size={20} />
//                                         Importer les cartes
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//                             <AlertCircle className="text-terracotta flex-shrink-0" size={20} />
//                             <div>
//                                 <p className="font-semibold text-terracotta-dark">Erreur</p>
//                                 <p className="text-sm text-terracotta">{error}</p>
//                             </div>
//                         </div>
//                     )}

//                     {result && (
//                         <div className="space-y-4">
//                             <div className={`rounded-lg p-4 ${result.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                                 <div className="flex items-center gap-3 mb-2">
//                                     {result.success > 0 ? (
//                                         <CheckCircle className="text-italian-green" size={24} />
//                                     ) : (
//                                         <AlertCircle className="text-terracotta" size={24} />
//                                     )}
//                                     <div>
//                                         <p className="font-semibold">
//                                             {result.success} carte(s) importée(s) avec succès
//                                         </p>
//                                         {result.failed > 0 && (
//                                             <p className="text-sm text-terracotta">
//                                                 {result.failed} échec(s)
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {result.errors.length > 0 && (
//                                     <div className="mt-4 bg-white rounded p-3 max-h-48 overflow-y-auto">
//                                         <p className="font-medium text-sm mb-2">Détails des erreurs:</p>
//                                         <ul className="text-xs space-y-1 text-gray-700">
//                                             {result.errors.map((err, i) => (
//                                                 <li key={i}>• {err}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>

//                             <button
//                                 onClick={onClose}
//                                 className="w-full bg-olive hover:bg-olive-dark text-white py-2 rounded-lg transition-colors"
//                             >
//                                 Fermer
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// src/features/flashcards/components/CardImport.tsx

import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
import Papa from 'papaparse';
import { FLASHCARDS_API_BASE } from '../../../constants';

interface CardImportProps {
    deckId: number;
    onImportComplete: (successCount: number) => void;
    onClose: () => void;
}

interface ImportCard {
    front: string;
    back: string;
    pronunciation?: string;
    image?: string;
    tags?: string[] | string;
}

interface ImportResult {
    success: number;
    failed: number;
    errors: string[];
}

export const CardImport: React.FC<CardImportProps> = ({ deckId, onImportComplete, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [preview, setPreview] = useState<ImportCard[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fonction utilitaire pour détecter si une chaîne est un emoji
    const isEmoji = (str: string): boolean => {
        if (!str || str.length === 0) return false;
        const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        return emojiRegex.test(str.trim()) || (str.length <= 4 && /[\u{1F000}-\u{1FAFF}]/u.test(str));
    };

    // Fonction pour convertir une URL en base64
    const urlToBase64 = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Échec du chargement de l'image: ${response.statusText}`);
            }
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            throw new Error(`Erreur lors de la conversion de l'URL en base64: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        }
    };

    // Fonction pour télécharger les exemples
    const downloadExample = (format: 'json' | 'csv') => {
        const exampleJSON = [
            { front: "Bonjour", back: "Ciao", pronunciation: "tʃaʊ", image: "👋", tags: ["salutation", "basique"] },
            { front: "Merci", back: "Grazie", pronunciation: "ˈɡrattsje", image: "🙏", tags: ["politesse", "basique"] },
            { front: "Au revoir", back: "Arrivederci", pronunciation: "arriːveˈdertʃi", tags: ["salutation"] },
            { front: "Oui", back: "Sì", pronunciation: "si", image: "✅", tags: ["basique"] },
            { front: "Non", back: "No", pronunciation: "nɔ", image: "❌", tags: ["basique"] },
            { front: "Un café", back: "Un caffè", pronunciation: "un kafˈfɛ", image: "☕", tags: ["nourriture", "boisson"] },
            { front: "Le chat", back: "Il gatto", pronunciation: "il ˈɡatto", image: "🐱", tags: ["animaux"] },
            { front: "La maison", back: "La casa", pronunciation: "la ˈkaːza", image: "🏠", tags: ["lieu"] },
            { front: "Comment allez-vous?", back: "Come sta?", tags: ["question", "salutation"] },
            { front: "Combien?", back: "Quanto?", pronunciation: "ˈkwanto", tags: ["question"] }
        ];

        const exampleCSV = `front,back,pronunciation,image,tags
Bonjour,Ciao,tʃaʊ,👋,salutation;basique
Merci,Grazie,ˈɡrattsje,🙏,politesse;basique
Au revoir,Arrivederci,arriːveˈdertʃi,,salutation
Oui,Sì,si,✅,basique
Non,No,nɔ,❌,basique
Un café,Un caffè,un kafˈfɛ,☕,nourriture;boisson
Le chat,Il gatto,il ˈɡatto,🐱,animaux
La maison,La casa,la ˈkaːza,🏠,lieu
Comment allez-vous?,Come sta?,,😊,question;salutation
Combien?,Quanto?,ˈkwanto,,question`;

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'json') {
            content = JSON.stringify(exampleJSON, null, 2);
            filename = 'exemple_flashcards.json';
            mimeType = 'application/json';
        } else {
            content = exampleCSV;
            filename = 'exemple_flashcards.csv';
            mimeType = 'text/csv;charset=utf-8;';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError(null);
        setResult(null);

        try {
            const cards = await parseFile(selectedFile);
            setPreview(cards.slice(0, 5));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier');
            setFile(null);
        }
    };

    const parseFile = async (file: File): Promise<ImportCard[]> => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension === 'json') {
            return parseJSON(file);
        } else if (extension === 'csv') {
            return parseCSV(file);
        } else {
            throw new Error('Format de fichier non supporté. Utilisez JSON ou CSV.');
        }
    };

    const parseJSON = async (file: File): Promise<ImportCard[]> => {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
            throw new Error('Le fichier JSON doit contenir un tableau de cartes');
        }

        return data.map((card, index) => {
            if (!card.front || !card.back) {
                throw new Error(`Carte ${index + 1}: les champs "front" et "back" sont obligatoires`);
            }
            
            const imageValue = card.image !== undefined && card.image !== null ? String(card.image).trim() : '';
            
            return {
                front: String(card.front).trim(),
                back: String(card.back).trim(),
                pronunciation: card.pronunciation ? String(card.pronunciation).trim() : '',
                image: imageValue,
                tags: Array.isArray(card.tags) ? card.tags : []
            };
        });
    };

    const parseCSV = async (file: File): Promise<ImportCard[]> => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false,
                delimitersToGuess: [',', ';', '\t'],
                complete: (results) => {
                    try {
                        const cards = results.data.map((row: any, index: number) => {
                            const cleanRow: any = {};
                            Object.keys(row).forEach(key => {
                                cleanRow[key.trim()] = row[key];
                            });

                            if (!cleanRow.front || !cleanRow.back) {
                                throw new Error(`Ligne ${index + 2}: les colonnes "front" et "back" sont obligatoires`);
                            }

                            return {
                                front: cleanRow.front.trim(),
                                back: cleanRow.back.trim(),
                                pronunciation: cleanRow.pronunciation?.trim() || '',
                                image: cleanRow.image?.trim() || '',
                                tags: cleanRow.tags 
                                    ? cleanRow.tags.split(';').map((t: string) => t.trim()).filter(Boolean)
                                    : []
                            };
                        });
                        resolve(cards);
                    } catch (err) {
                        reject(err);
                    }
                },
                error: (error) => {
                    reject(new Error(`Erreur de parsing CSV: ${error.message}`));
                }
            });
        });
    };

    const handleImport = async () => {
        if (!file) return;

        setIsImporting(true);
        setError(null);

        try {
            const cards = await parseFile(file);
            const errors: string[] = [];
            let successCount = 0;

            for (let i = 0; i < cards.length; i++) {
                try {
                    await createCard(cards[i]);
                    successCount++;
                } catch (err) {
                    errors.push(`Carte ${i + 1} (${cards[i].front}): ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
                }
            }

            setResult({
                success: successCount,
                failed: errors.length,
                errors
            });

            if (successCount > 0) {
                setTimeout(() => {
                    onImportComplete(successCount);
                }, 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
        } finally {
            setIsImporting(false);
        }
    };

    const createCard = async (cardData: ImportCard) => {
        let image = cardData.image || '';
        
        // Convertir URL en base64 si c'est une URL (et non un emoji ou déjà base64)
        if (image && !isEmoji(image) && !image.startsWith('data:') && (image.startsWith('http://') || image.startsWith('https://'))) {
            image = await urlToBase64(image);
        }

        const payload = {
            deck_pk: deckId,
            front: cardData.front,
            back: cardData.back,
            pronunciation: cardData.pronunciation || '',
            image: image,
            tags: Array.isArray(cardData.tags) ? cardData.tags : [],
            created_at: new Date().toISOString(),
            next_review: new Date().toISOString()
        };

        const response = await fetch(`${FLASHCARDS_API_BASE}/cards/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Erreur serveur' }));
            throw new Error(errorData.detail || 'Échec de création');
        }

        return response.json();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-italian-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-italian-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif text-charcoal">Importer des cartes</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <FileText size={18} />
                            Formats acceptés
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1.5">
                            <li>• <strong>Obligatoire:</strong> front, back</li>
                            <li>• <strong>Optionnel:</strong> pronunciation, image, tags</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-sm text-blue-900 font-medium mb-1.5">📸 Images (optionnelles):</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• <strong>Emojis</strong>: 👋 🙏 ☕ 🏠 (recommandé)</li>
                                <li>• <strong>URLs</strong>: https://example.com/image.jpg</li>
                                <li>• <strong>Base64</strong>: data:image/png;base64,...</li>
                                <li>• <strong>Sans image</strong>: Laissez vide ou omettez le champ</li>
                            </ul>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200 flex gap-3 justify-center">
                            <button
                                onClick={() => downloadExample('json')}
                                className="text-xs text-olive hover:text-olive-dark underline flex items-center gap-1"
                            >
                                <Download size={12} />
                                Télécharger exemple JSON
                            </button>
                            <button
                                onClick={() => downloadExample('csv')}
                                className="text-xs text-olive hover:text-olive-dark underline flex items-center gap-1"
                            >
                                <Download size={12} />
                                Télécharger exemple CSV
                            </button>
                        </div>
                    </div>

                    {!file && !result && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-olive transition-colors">
                            <input
                                type="file"
                                accept=".json,.csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600">Cliquez pour sélectionner un fichier</p>
                                <p className="text-sm text-gray-400 mt-2">JSON ou CSV</p>
                            </label>
                        </div>
                    )}

                    {file && !result && preview.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="text-olive" size={20} />
                                    <span className="font-medium">{file.name}</span>
                                    <span className="text-sm text-gray-500">({preview.length}+ cartes détectées)</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setPreview([]);
                                    }}
                                    className="text-terracotta hover:text-terracotta-dark"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-gray-700">Aperçu (5 premières cartes)</h4>
                                <div className="space-y-3">
                                    {preview.map((card, index) => (
                                        <div key={index} className="bg-white rounded border border-gray-200 p-4 flex gap-3">
                                            {card.image && (
                                                <div className="flex-shrink-0">
                                                    {isEmoji(card.image) ? (
                                                        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                                                            {card.image}
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={card.image} 
                                                            alt={card.front}
                                                            className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="truncate">
                                                        <span className="text-gray-500 font-medium">Front:</span> {card.front}
                                                    </div>
                                                    <div className="truncate">
                                                        <span className="text-gray-500 font-medium">Back:</span> {card.back}
                                                    </div>
                                                </div>
                                                {card.pronunciation && (
                                                    <div className="text-xs text-olive mt-1 flex items-center gap-1">
                                                        <span className="font-medium">IPA:</span> {card.pronunciation}
                                                    </div>
                                                )}
                                                {card.tags && Array.isArray(card.tags) && card.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {card.tags.slice(0, 3).map((tag, tagIndex) => (
                                                            <span key={tagIndex} className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {card.tags.length > 3 && (
                                                            <span className="text-gray-400 text-xs">+{card.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleImport}
                                disabled={isImporting}
                                className="w-full bg-italian-green hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Import en cours...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Importer les cartes
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-terracotta flex-shrink-0" size={20} />
                            <div>
                                <p className="font-semibold text-terracotta-dark">Erreur</p>
                                <p className="text-sm text-terracotta">{error}</p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            <div className={`rounded-lg p-4 ${result.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {result.success > 0 ? (
                                        <CheckCircle className="text-italian-green" size={24} />
                                    ) : (
                                        <AlertCircle className="text-terracotta" size={24} />
                                    )}
                                    <div>
                                        <p className="font-semibold">
                                            {result.success} carte(s) importée(s) avec succès
                                        </p>
                                        {result.failed > 0 && (
                                            <p className="text-sm text-terracotta">
                                                {result.failed} échec(s)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {result.errors.length > 0 && (
                                    <div className="mt-4 bg-white rounded p-3 max-h-48 overflow-y-auto">
                                        <p className="font-medium text-sm mb-2">Détails des erreurs:</p>
                                        <ul className="text-xs space-y-1 text-gray-700">
                                            {result.errors.map((err, i) => (
                                                <li key={i}>• {err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-olive hover:bg-olive-dark text-white py-2 rounded-lg transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};