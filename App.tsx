import React, { useState } from 'react';
import FlashcardsApp from './components/FlashcardsApp';
import AudioApp from './components/AudioApp';
import { BookOpen, Mic } from 'lucide-react';

type AppView = 'flashcards' | 'audio';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppView>('flashcards');

  const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-italian-green text-white shadow-md'
          : 'bg-transparent text-charcoal hover:bg-italian-green/10'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-off-white font-sans text-charcoal">
      <header className="bg-italian-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-serif tracking-tight">
            Apprendiamo <span className="text-italian-green">italiano</span>
          </div>
          <div className="flex items-center gap-4">
            <NavButton
              onClick={() => setCurrentApp('flashcards')}
              isActive={currentApp === 'flashcards'}
            >
              <BookOpen size={18} />
              <span>Flashcards</span>
            </NavButton>
            <NavButton
              onClick={() => setCurrentApp('audio')}
              isActive={currentApp === 'audio'}
            >
              <Mic size={18} />
              <span>Bibliothèque Audio</span>
            </NavButton>
          </div>
        </nav>
      </header>

      <main>
        {currentApp === 'flashcards' ? <FlashcardsApp /> : <AudioApp />}
      </main>
    </div>
  );
};

export default App;