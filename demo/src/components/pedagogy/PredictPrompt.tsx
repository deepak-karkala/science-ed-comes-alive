import { useState } from 'react';
import { Language } from '../../lib/types/lesson';
import { getTranslation } from '../../lib/i18n';

interface PredictPromptProps {
  prompt: string;
  language: Language;
  onSubmit: (text: string) => void;
}

export function PredictPrompt({ prompt, language, onSubmit }: PredictPromptProps) {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
      <div className="mb-6">
        <span className="micro-label text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded-md mb-4 inline-block">
          Prediction Phase
        </span>
        <h3 className="text-xl font-medium text-[var(--text-primary)] leading-relaxed">
          {prompt}
        </h3>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your hypothesis here..."
        className="flex-grow w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all mb-4"
        aria-label="Prediction input"
      />
      
      <div className="flex justify-end mt-auto">
        <button
          onClick={() => onSubmit(text)}
          disabled={text.trim().length === 0}
          className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 active:scale-95"
        >
          {getTranslation('common.next', language)}
        </button>
      </div>
    </div>
  );
}
