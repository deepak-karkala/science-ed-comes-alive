import Link from 'next/link'
import { notFound } from 'next/navigation'

const lessonTitles: Record<string, string> = {
  '1': 'Electromagnetic Induction',
  '2': 'Acid-Base + pH',
  '3': 'Red Blood Cell Journey',
}

interface LessonPageProps {
  params: {
    id: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const title = lessonTitles[params.id]

  if (!title) {
    notFound()
  }

  return (
    <main className="page-shell">
      <Link className="text-link" href="/">
        Back to lessons
      </Link>
      <section className="panel">
        <p className="micro-label">Lesson {params.id}</p>
        <h1 className="wordmark mt-3">{title}</h1>
        <p className="muted-copy mt-4">
          Build-safe placeholder route. The lesson shell and verified simulation will be added in later tasks.
        </p>
      </section>
    </main>
  )
}
