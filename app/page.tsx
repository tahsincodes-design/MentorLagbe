import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { SiteFooter } from "@/components/site/site-footer"

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
