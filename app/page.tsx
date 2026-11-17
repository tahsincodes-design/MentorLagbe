import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <main id="home">
        <Hero />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  )
}
