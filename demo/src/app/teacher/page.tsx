import Link from 'next/link'

export default function TeacherPage() {
  return (
    <main className="page-shell">
      <Link className="text-link" href="/">
        Back to lessons
      </Link>
      <section className="panel">
        <p className="micro-label">Teacher View</p>
        <h1 className="wordmark mt-3">Misconception Heatmap</h1>
        <p className="muted-copy mt-4">
          Build-safe placeholder route. Mock class analytics will be added in a later task.
        </p>
      </section>
    </main>
  )
}
