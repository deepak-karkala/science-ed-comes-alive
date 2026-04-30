'use client';

import { useState } from 'react';
import { LessonConfig, LessonPhase, Language } from '../../lib/types/lesson';
import { LanguageToggle } from './LanguageToggle';
import { PredictPrompt } from '../pedagogy/PredictPrompt';
import { ApplyCard } from '../pedagogy/ApplyCard';

interface LessonShellProps {
  lesson: LessonConfig;
}

export function LessonShell({ lesson }: LessonShellProps) {
  const [phase, setPhase] = useState<LessonPhase>('PREDICT');
  const [language, setLanguage] = useState<Language>('en');
  
  // State machine mock triggers for Task 7
  const [experimentInteractions, setExperimentInteractions] = useState(0);
  const [aiExchangeCount, setAiExchangeCount] = useState(0);

  const handleExperimentInteraction = () => {
    setExperimentInteractions(prev => prev + 1);
    if (phase === 'EXPERIMENT') {
      // Transition to EXPLAIN after first interaction
      setPhase('EXPLAIN');
    }
  };

  const handleAiExchange = () => {
    const newCount = aiExchangeCount + 1;
    setAiExchangeCount(newCount);
    if (phase === 'EXPLAIN' && newCount >= 2) {
      setPhase('APPLY');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex-none flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <div>
          <p className="micro-label text-[var(--accent)]">{lesson.subject}</p>
          <h1 className="text-xl font-bold">{lesson.title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)]">PHASE:</span>
            <span className="font-mono text-sm px-2 py-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded">
              {phase}
            </span>
          </div>
          
          <LanguageToggle current={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex overflow-hidden">
        {/* Left Column: Simulation */}
        <section className="flex-1 flex flex-col border-r border-[var(--border)] relative bg-[var(--background)]">
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-[var(--text-muted)] border-b border-[var(--border)] gap-4">
            <span>[ Simulation Area ]</span>
            {phase !== 'PREDICT' && (
              <button 
                onClick={handleExperimentInteraction}
                className="px-4 py-2 bg-[var(--surface-hover)] border border-[var(--border)] rounded text-sm hover:text-[var(--text-primary)]"
              >
                Mock: Interact with Simulation
              </button>
            )}
          </div>
          {/* Controls Area */}
          <div className="h-48 flex items-center justify-center p-4 bg-[var(--surface)]">
            [ Controls Area ]
          </div>
        </section>

        {/* Right Column: AI / Pedagogy */}
        <section className="w-[400px] flex-none flex flex-col bg-[var(--surface)] border-l border-[var(--border)]">
          <div className="flex-1 overflow-y-auto p-4 border-b border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
            {phase === 'PREDICT' ? (
              <PredictPrompt 
                prompt={lesson.applyPrompt} 
                language={language} 
                onSubmit={(text) => {
                  console.log('Prediction submitted:', text);
                  setPhase('EXPERIMENT');
                }} 
              />
            ) : phase === 'APPLY' ? (
              <ApplyCard 
                lesson={lesson} 
                onFinish={() => console.log('Mission finished')} 
              />
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <span>[ Pedagogy/Chat Area - {phase} phase ]</span>
                {phase === 'EXPLAIN' && (
                  <button 
                    onClick={handleAiExchange}
                    className="px-4 py-2 bg-[var(--surface-hover)] border border-[var(--border)] rounded text-sm hover:text-[var(--text-primary)]"
                  >
                    Mock: AI Exchange (Count: {aiExchangeCount})
                  </button>
                )}
                {phase === 'EXPERIMENT' && (
                  <span className="text-xs text-[var(--text-muted)] text-center max-w-xs">
                    Socratic chat is locked. Interact with the simulation to unlock.
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Input Area */}
          <div className="p-4 flex items-center justify-center text-[var(--text-muted)]">
            [ Input Area ]
          </div>
        </section>
      </main>
    </div>
  );
}
