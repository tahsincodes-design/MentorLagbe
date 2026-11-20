import { audiences, tuitionSteps } from "@/components/about/content"

export function AboutOverview() {
  return (
    <>
      <section
        aria-labelledby="purpose-heading"
        className="grid gap-7 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
      >
        <div>
          <h2
            id="purpose-heading"
            className="max-w-md text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Clear details make it easier to get started.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            Our goal is to help students decide which lessons fit their needs
            and give tutors a clear way to share what they offer.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {audiences.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-3xl border bg-card p-5 sm:p-6"
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-brand-coral/15 text-brand-navy dark:text-brand-cream">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="workflow-heading"
        className="rounded-[2rem] border bg-card p-6 sm:p-9"
      >
        <h2
          id="workflow-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          From listing to application
        </h2>
        <ol className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-3 md:gap-7">
          {tuitionSteps.map(({ title, description, icon: Icon }) => (
            <li key={title} className="flex gap-3">
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-brand-coral-deep dark:text-brand-coral"
              />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
