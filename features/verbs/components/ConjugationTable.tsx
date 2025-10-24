import React, { useState } from 'react';
import type { VerbData, MoodData } from '../types';
import { ChevronDownIcon } from './icons/Icons';
import { VerbIcon } from './icons/VerbIcon';

interface AccordionProps {
    mood: MoodData;
    isOpen: boolean;
    onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ mood, isOpen, onToggle }) => {
    return (
        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden mb-4 glass-card shadow-lg card-hover">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-5 bg-gradient-to-r from-italian-green/5 to-olive/5 hover:from-italian-green/10 hover:to-olive/10 transition-all duration-200"
            >
                <h3 className="text-2xl font-bold text-italian-green">{mood.mood}</h3>
                <ChevronDownIcon className={`w-7 h-7 text-italian-green transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {mood.tenses.map(tense => (
                        <div key={tense.tense} className="border-2 border-olive/30 rounded-xl p-5 bg-gradient-to-br from-white to-olive/5 hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-olive-dark mb-4 text-center pb-2 border-b-2 border-olive/20 text-lg">{tense.tense}</h4>
                            <ul className="space-y-2 text-gray-700">
                                {tense.conjugations.map(c => (
                                    <li key={c.person} className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-charcoal">{c.person}</span>
                                        <span className="text-italian-green font-medium">{c.verb}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ConjugationTableProps {
    data: VerbData;
}

export const ConjugationTable: React.FC<ConjugationTableProps> = ({ data }) => {
    const [openMood, setOpenMood] = useState<string | null>(data.conjugations[0]?.mood || null);

    const toggleMood = (moodName: string) => {
        setOpenMood(prev => (prev === moodName ? null : moodName));
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-10 glass-card p-8 rounded-3xl shadow-xl border-2 border-italian-green/20">
                <div className="flex justify-center items-center h-24 w-24 mx-auto mb-5 bg-gradient-to-br from-italian-green to-olive rounded-full text-white shadow-lg">
                    <VerbIcon iconSuggestion={data.icon_suggestion} className="w-14 h-14" />
                </div>
                <h2 className="text-5xl font-bold text-charcoal capitalize mb-2">{data.verb}</h2>
                <p className="text-xl italic text-gray-600 mt-2">({data.translation})</p>
            </div>
            {data.conjugations.map(mood => (
                <Accordion
                    key={mood.mood}
                    mood={mood}
                    isOpen={openMood === mood.mood}
                    onToggle={() => toggleMood(mood.mood)}
                />
            ))}
        </div>
    );
};