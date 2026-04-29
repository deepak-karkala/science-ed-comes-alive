import Link from 'next/link'

export default function TeacherPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <Link className="text-sm text-amber-300 underline-offset-4 hover:underline" href="/">
        Back to lessons
      </Link>
      <section className="rounded-lg border border-amber-300/20 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-amber-300">Teacher View</p>
        <h1 className="mt-3 text-3xl font-semibold">Misconception Heatmap</h1>
        <p className="mt-4 text-stone-300">
          Build-safe placeholder route. Mock class analytics will be added in a later task.
        </p>
      </section>
    </main>
  )
}
