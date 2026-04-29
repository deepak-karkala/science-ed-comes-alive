import Link from 'next/link'

const lessons = [
  { id: '1', title: 'Electromagnetic Induction', subject: 'Physics' },
  { id: '2', title: 'Acid-Base + pH', subject: 'Chemistry' },
  { id: '3', title: 'Red Blood Cell Journey', subject: 'Biology' },
]

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.18em] text-amber-300">Vigyan Dost</p>
        <h1 className="text-4xl font-semibold">Science Education Comes Alive</h1>
        <p className="max-w-2xl text-base text-stone-300">
          Placeholder lesson selector for the investor demo scaffold.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Demo lessons">
        {lessons.map((lesson) => (
          <Link
            className="rounded-lg border border-amber-300/20 bg-white/5 p-5 transition hover:border-amber-300/60"
            href={`/lesson/${lesson.id}`}
            key={lesson.id}
          >
            <p className="text-sm text-amber-300">{lesson.subject}</p>
            <h2 className="mt-2 text-xl font-semibold">{lesson.title}</h2>
          </Link>
        ))}
      </section>

      <Link className="w-fit text-sm text-amber-300 underline-offset-4 hover:underline" href="/teacher">
        Open teacher dashboard placeholder
      </Link>
    </main>
  )
}
