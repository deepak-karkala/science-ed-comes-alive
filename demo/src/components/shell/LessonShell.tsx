'use client';

import { useState } from 'react';
import { LessonConfig, LessonPhase, Language } from '../../lib/types/lesson';
import { LanguageToggle } from './LanguageToggle';
import { PredictPrompt } from '../pedagogy/PredictPrompt';
import { ApplyCard } from '../pedagogy/ApplyCard';
import { SocraticChat } from '../pedagogy/SocraticChat';

interface LessonShellProps {
  lesson: LessonConfig;
  simulationArea?: React.ReactNode;
  controlsArea?: React.ReactNode;
}

export function LessonShell({ lesson, simulationArea, controlsArea }: LessonShellProps) {
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
          <div className="flex-1 flex flex-col p-4 border-b border-[var(--border)] relative">
            {simulationArea || (
              <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
                [ Simulation Area ]
              </div>
            )}
            
            {/* Mock trigger - hidden in production */}
            {phase !== 'PREDICT' && !simulationArea && (
              <button 
                onClick={handleExperimentInteraction}
                className="absolute bottom-4 right-4 px-4 py-2 bg-[var(--surface-hover)] border border-[var(--border)] rounded text-sm hover:text-[var(--text-primary)]"
              >
                Mock: Interact with Simulation
              </button>
            )}
          </div>
          {/* Controls Area */}
          <div className="h-48 bg-[var(--surface)] border-b border-[var(--border)]">
            {controlsArea || (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)]">
                [ Controls Area ]
              </div>
            )}
          </div>
        </section>

        {/* Right Column: AI / Pedagogy */}
        <section className="w-[400px] flex-none flex flex-col bg-[var(--surface)] border-l border-[var(--border)]">
          {phase === 'PREDICT' ? (
            <div className="flex-1 overflow-y-auto p-4 border-b border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
              <PredictPrompt 
                prompt={lesson.applyPrompt} 
                language={language} 
                onSubmit={(text) => {
                  console.log('Prediction submitted:', text);
                  setPhase('EXPERIMENT');
                }} 
              />
            </div>
          ) : phase === 'APPLY' ? (
            <div className="flex-1 overflow-y-auto p-4 border-b border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
              <ApplyCard 
                lesson={lesson} 
                onFinish={() => console.log('Mission finished')} 
              />
            </div>
          ) : phase === 'EXPERIMENT' ? (
            <div className="flex-1 overflow-y-auto p-4 border-b border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
              <div className="flex flex-col gap-4 items-center">
                <span className="text-xs text-[var(--text-muted)] text-center max-w-xs">
                  Socratic chat is locked. Interact with the simulation to unlock.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <SocraticChat 
                subject={lesson.subject} 
                simulationState={{ phase, experimentInteractions }} 
                onExchange={handleAiExchange} 
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
