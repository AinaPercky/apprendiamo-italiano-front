import React from 'react';
import * as LucideIcons from 'lucide-react';

interface VerbIconProps {
    iconSuggestion: string;
    className?: string;
}

export const VerbIcon: React.FC<VerbIconProps> = ({ iconSuggestion, className = 'w-10 h-10' }) => {
    const iconName = iconSuggestion
        .split('-')
        .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    const IconComponent = (LucideIcons as any)[iconName];

    if (IconComponent) {
        return <IconComponent className={className} />;
    }

    return <LucideIcons.BookOpen className={className} />;
};
