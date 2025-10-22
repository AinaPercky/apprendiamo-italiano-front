import React from 'react';
import { COMMON_VERBS } from '../constants';

interface VerbSelectorProps {
    selectedVerb: string;
    onVerbChange: (verb: string) => void;
}

export const VerbSelector: React.FC<VerbSelectorProps> = ({ selectedVerb, onVerbChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="verb-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un verbe
                </label>
                <select
                    id="verb-select"
                    value={selectedVerb}
                    onChange={(e) => onVerbChange(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-italian-green focus:border-italian-green transition"
                >
                    {COMMON_VERBS.map(verb => (
                        <option key={verb} value={verb}>
                            {verb}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-sm text-gray-500">
                ou entrez un verbe personnalisé :
            </div>
            <input
                type="text"
                placeholder="Ex: cantare"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onVerbChange(e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                    }
                }}
                className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-italian-green focus:border-italian-green transition"
            />
        </div>
    );
};
