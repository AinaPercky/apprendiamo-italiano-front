import React, { useState } from 'react';
import { LearnView } from '../features/verbs/components/LearnView';
import { QuizView } from '../features/verbs/components/QuizView';
import { BookOpen, HelpCircle } from 'lucide-react';

type VerbView = 'learn' | 'quiz';

const VerbsApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<VerbView>('learn');

  const navItemClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200";
  const activeClasses = "bg-italian-green text-white shadow-md";
  const inactiveClasses = "text-charcoal hover:bg-italian-green/10";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 animate-slide-in">
          <div>
            <h1 className="text-4xl font-bold text-charcoal font-serif mb-2 flex items-center gap-3">
              ✏️ Conjugaisons Italiennes
            </h1>
            <p className="mt-2 text-gray-600 text-lg">Maîtrisez les verbes italiens avec notre outil intelligent</p>
          </div>
          <nav className="flex gap-2 p-1.5 glass-card rounded-2xl shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setCurrentView('learn')}
              className={`${navItemClasses} ${currentView === 'learn' ? activeClasses : inactiveClasses}`}
            >
              <BookOpen size={20} />
              <span className="font-bold text-sm">Apprendre</span>
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className={`${navItemClasses} ${currentView === 'quiz' ? activeClasses : inactiveClasses}`}
            >
              <HelpCircle size={20} />
              <span className="font-bold text-sm">Quiz</span>
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {currentView === 'learn' ? <LearnView /> : <QuizView />}
        </div>
      </div>
    </div>
  );
};

export default VerbsApp;
