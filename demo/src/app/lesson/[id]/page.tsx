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
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <Link className="text-sm text-amber-300 underline-offset-4 hover:underline" href="/">
        Back to lessons
      </Link>
      <section className="rounded-lg border border-amber-300/20 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-amber-300">Lesson {params.id}</p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-stone-300">
          Build-safe placeholder route. The lesson shell and verified simulation will be added in later tasks.
        </p>
      </section>
    </main>
  )
}
