export default function Page() {
  return (
    <main id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-5xl"
      >
        <div className="absolute top-[-14rem] left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-brand-coral/15 blur-3xl" />
        <div className="absolute top-24 right-0 size-56 rounded-full bg-brand-navy/5 blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
        <span className="rounded-full border border-brand-coral/25 bg-brand-coral/10 px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.22em] text-brand-coral uppercase">
          Mentorship, made personal
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-6xl">
          Find the mentor who{" "}
          <span className="text-brand-coral">gets you.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
          Learn from trusted mentors, book the right tuition, and move forward
          with confidence.
        </p>
      </section>
    </main>
  )
}
