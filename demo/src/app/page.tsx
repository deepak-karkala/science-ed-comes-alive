import Link from 'next/link';
import { LESSONS } from '../data/lessons';
import { LessonCard } from '../components/demo/LessonCard';

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="space-y-3">
        <p className="micro-label text-[var(--accent)]">Vigyan Dost</p>
        <h1 className="wordmark">Science Education Comes Alive</h1>
        <p className="muted-copy max-w-2xl">
          Select a mission below to experience verified interactive simulations with Socratic guidance.
        </p>
      </header>

      <section className="lesson-grid" aria-label="Demo lessons">
        {LESSONS.map((lesson, index) => (
          <LessonCard 
            key={lesson.id}
            lesson={lesson}
            index={index + 1}
          />
        ))}
      </section>

      <div className="mt-12 flex justify-center">
        <Link className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4" href="/teacher">
          View Teacher Dashboard
        </Link>
      </div>
    </main>
  );
}
