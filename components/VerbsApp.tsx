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
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal font-serif">Conjugaisons italiennes</h1>
            <p className="mt-2 text-gray-600">Apprenez et testez vos connaissances des verbes italiens</p>
          </div>
          <nav className="flex gap-2 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setCurrentView('learn')}
              className={`${navItemClasses} ${currentView === 'learn' ? activeClasses : inactiveClasses}`}
            >
              <BookOpen size={18} />
              <span className="font-semibold text-sm">Apprendre</span>
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className={`${navItemClasses} ${currentView === 'quiz' ? activeClasses : inactiveClasses}`}
            >
              <HelpCircle size={18} />
              <span className="font-semibold text-sm">Quiz</span>
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
