import Link from 'next/link';
import { LessonConfig } from '../../lib/types/lesson';

interface LessonCardProps {
  lesson: LessonConfig;
  index: number;
}

export function LessonCard({ lesson, index }: LessonCardProps) {
  return (
    <Link 
      href={`/lesson/${lesson.id}`} 
      className="lesson-card group flex flex-col h-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] relative overflow-hidden"
    >
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex justify-between items-center mb-4">
        <span className="micro-label capitalize text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded-md">
          {lesson.subject}
        </span>
        <span className="text-xs font-mono text-[var(--text-muted)] opacity-50">
          MISSION 0{index}
        </span>
      </div>
      
      <h2 className="lesson-title text-2xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
        {lesson.title}
      </h2>
      
      <div className="text-sm text-[var(--text-secondary)] mb-6 flex-grow">
        <p className="font-medium text-[var(--text-primary)] mb-1">
          {lesson.summaryCopy.dinnerTableQuestion}
        </p>
        <p className="opacity-70 text-xs">
          {lesson.ncertReference}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-[var(--border)] border-opacity-50 flex items-center justify-between text-sm font-medium text-[var(--accent)]">
        <span>Enter simulation</span>
        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}
