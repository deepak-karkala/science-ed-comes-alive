import { LessonConfig } from '../../lib/types/lesson';

interface ApplyCardProps {
  lesson: LessonConfig;
  onFinish: () => void;
}

export function ApplyCard({ lesson, onFinish }: ApplyCardProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm overflow-y-auto">
      <div className="mb-6">
        <span className="micro-label text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded-md mb-4 inline-block">
          Mission Complete
        </span>
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Knowledge Applied
        </h3>
        <p className="text-[var(--text-secondary)]">
          You have successfully completed the {lesson.title} mission.
        </p>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Concepts Mastered
        </h4>
        <div className="flex flex-wrap gap-2">
          {lesson.summaryCopy.concepts.map((concept) => (
            <span key={concept} className="px-3 py-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-primary)]">
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8 p-4 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />
        <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Dinner Table Question
        </h4>
        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
          {lesson.summaryCopy.dinnerTableQuestion}
        </p>
      </div>

      <div className="mt-auto">
        <button
          onClick={onFinish}
          className="w-full px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium transition-all hover:bg-opacity-90 active:scale-95 shadow-md shadow-[var(--accent-glow)]"
        >
          Finish Mission
        </button>
      </div>
    </div>
  );
}
