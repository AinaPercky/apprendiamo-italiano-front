import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="w-16 h-16 border-4 border-italian-green/20 border-t-italian-green rounded-full animate-spin"></div>
        </div>
    );
};
