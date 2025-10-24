import React, { useState } from 'react';
import FlashcardsApp from './components/FlashcardsApp';
import AudioApp from './components/AudioApp';
import VerbsApp from './components/VerbsApp';
import { BookOpen, Mic, Languages } from 'lucide-react';

type AppView = 'flashcards' | 'audio' | 'verbs';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppView>('flashcards');

  const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 nav-underline ${
        isActive
          ? 'bg-italian-green text-white shadow-lg scale-105 active'
          : 'bg-white text-charcoal hover:bg-italian-green/10 hover:shadow-md'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen font-sans text-charcoal">
      <header className="glass-card shadow-lg sticky top-0 z-50 border-b-2 border-italian-green/20">
        <div className="italian-flag-accent"></div>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="text-3xl font-bold font-serif tracking-tight flex items-center gap-2 animate-fade-in">
            <span className="text-5xl">🇮🇹</span>
            <div>
              Apprendiamo <span className="text-italian-green">Italiano</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavButton
              onClick={() => setCurrentApp('flashcards')}
              isActive={currentApp === 'flashcards'}
            >
              <BookOpen size={20} />
              <span>Flashcards</span>
            </NavButton>
            <NavButton
              onClick={() => setCurrentApp('audio')}
              isActive={currentApp === 'audio'}
            >
              <Mic size={20} />
              <span>Audio</span>
            </NavButton>
            <NavButton
              onClick={() => setCurrentApp('verbs')}
              isActive={currentApp === 'verbs'}
            >
              <Languages size={20} />
              <span>Verbes</span>
            </NavButton>
          </div>
        </nav>
      </header>

      <main className="animate-fade-in">
        {currentApp === 'flashcards' && <FlashcardsApp />}
        {currentApp === 'audio' && <AudioApp />}
        {currentApp === 'verbs' && <VerbsApp />}
      </main>

      <footer className="mt-16 py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-gray-600 mb-2">
            Fait avec ❤️ pour apprendre l'italien
          </div>
          <div className="italian-flag-accent w-32 mx-auto"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;