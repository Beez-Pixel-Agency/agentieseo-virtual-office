import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "AgentieSEO — Virtual Office", description: "Platforma interna AgentieSEO.net", robots: "noindex,nofollow" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ro"><body className="bg-[#06070a] text-white antialiased overflow-hidden h-screen w-screen">{children}</body></html>)
}
