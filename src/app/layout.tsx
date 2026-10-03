import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({ weight: "400", variable: "--font-display", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceCraft — Real-Time Voice Agents on CPU",
  description: "The definitive CPU voice stack. Real-time TTS, <300ms latency, no GPU required. Research presentation by DeepSeek.",
  openGraph: { title: "VoiceCraft", description: "Real-time voice agents on CPU — no GPU required." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${geist.variable} ${geistMono.variable} ${display.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-full bg-[#08080a] text-zinc-100 selection:bg-amber-400 selection:text-zinc-900">{children}</body>
    </html>
  );
}
