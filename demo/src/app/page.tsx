import Link from 'next/link'

const lessons = [
  { id: '1', title: 'Electromagnetic Induction', subject: 'Physics' },
  { id: '2', title: 'Acid-Base + pH', subject: 'Chemistry' },
  { id: '3', title: 'Red Blood Cell Journey', subject: 'Biology' },
]

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="space-y-3">
        <p className="micro-label">Vigyan Dost</p>
        <h1 className="wordmark">Science Education Comes Alive</h1>
        <p className="muted-copy max-w-2xl">
          Placeholder lesson selector for the investor demo scaffold.
        </p>
      </header>

      <section className="lesson-grid" aria-label="Demo lessons">
        {lessons.map((lesson) => (
          <Link
            className="lesson-card"
            href={`/lesson/${lesson.id}`}
            key={lesson.id}
          >
            <p className="micro-label">{lesson.subject}</p>
            <h2 className="lesson-title mt-2">{lesson.title}</h2>
          </Link>
        ))}
      </section>

      <Link className="text-link" href="/teacher">
        Open teacher dashboard placeholder
      </Link>
    </main>
  )
}
