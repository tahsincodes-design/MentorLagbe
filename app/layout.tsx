import { Caveat, Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        caveat.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
