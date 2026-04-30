import { Language } from '../../lib/types/lesson';

interface LanguageToggleProps {
  current: Language;
  onChange: (lang: Language) => void;
}

export function LanguageToggle({ current, onChange }: LanguageToggleProps) {
  return (
    <div className="flex bg-[var(--surface-hover)] rounded-full p-1 border border-[var(--border)]" role="group" aria-label="Language selection">
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          current === 'en' 
            ? 'bg-[var(--accent)] text-white shadow-sm' 
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
        aria-pressed={current === 'en'}
      >
        English
      </button>
      <button
        onClick={() => onChange('hi')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          current === 'hi' 
            ? 'bg-[var(--accent)] text-white shadow-sm' 
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
        aria-pressed={current === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
}
