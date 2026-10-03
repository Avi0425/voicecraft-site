"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false, loading: () => <div className="h-full w-full bg-[#0a0a0c]" /> });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Model = {
  id: string;
  name: string;
  tag: string;
  params: string;
  license: string;
  latency: string;
  rtf: string;
  langs: string;
  hf: string;
  gh: string;
  accent: string;
  blurb: string;
};

const MODELS: Model[] = [
  { id: "piper", name: "Piper TTS", tag: "#1 CPU PICK", params: "15–30M", license: "MIT / GPL-3.0", latency: "<150ms", rtf: "0.25", langs: "40+ · 100 voices", hf: "rhasspy/piper-voices", gh: "OHF-Voice/piper1-gpl · 5.7k★", accent: "from-amber-400 to-orange-500", blurb: "Fastest RTF on 2-core. ONNX, RPi-proven, Home Assistant standard. 120MB RAM." },
  { id: "kokoro", name: "Kokoro-82M", tag: "QUALITY / CPU", params: "82M", license: "Apache-2.0", latency: "<250ms", rtf: "0.15", langs: "9 · 54 voices", hf: "hexgrad/Kokoro-82M · 11.4M dl/mo", gh: "hexgrad/kokoro · 9.1k★", accent: "from-violet-400 to-fuchsia-500", blurb: "StyleTTS2 + ISTFTNet. 2–4× faster than larger models. Best quality-per-param." },
  { id: "vibe", name: "VibeVoice-Realtime", tag: "STREAMING", params: "0.5B + 380M", license: "MIT", latency: "~300ms first audio", rtf: "0.60", langs: "EN + 9 exp.", hf: "microsoft/VibeVoice-Realtime-0.5B", gh: "microsoft/VibeVoice", accent: "from-cyan-400 to-teal-400", blurb: "Speaks from LLM's first token. 7.5Hz tokenizer, DPM-Solver. Live narration." },
  { id: "kitten", name: "Kitten + NeuTTS Air", tag: "EDGE", params: "15M · 0.5B GGUF", license: "Apache-2.0", latency: "300–600ms", rtf: "0.5 / 0.8", langs: "EN · cloning 3s", hf: "KittenML + neuphonic", gh: "KittenML/neutts-air", accent: "from-emerald-400 to-lime-400", blurb: "25MB on RPi Zero. GGUF via llama.cpp — runs wherever your LLM runs." },
  { id: "melo", name: "MeloTTS + Supertonic 3", tag: "MULTILINGUAL", params: "30M · 99M ONNX", license: "MIT / OpenRAIL-M", latency: "200–250ms", rtf: "0.3–0.5", langs: "6 + 31 langs", hf: "myshell-ai + Supertone", gh: "myshell-ai/MeloTTS · 7.7k★", accent: "from-rose-400 to-pink-500", blurb: "Supertonic CPU beats 2B models on A100. MeloTTS: ZH mix, fastest setup." },
];

const BENCH = [
  { m: "Piper medium", hw: "RPi 4", ttfa: "180ms", rtf: "0.40", mem: "120MB" },
  { m: "Piper medium", hw: "2-core Xeon", ttfa: "90ms", rtf: "0.25", mem: "120MB" },
  { m: "Kokoro-82M", hw: "i5-11400", ttfa: "220ms", rtf: "0.15", mem: "400MB" },
  { m: "Kokoro-82M", hw: "M1 MPS", ttfa: "120ms", rtf: "0.10", mem: "400MB" },
  { m: "Supertonic 3", hw: "i7 CPU", ttfa: "250ms", rtf: "0.30", mem: "300MB" },
  { m: "Kitten 15M", hw: "RPi Zero", ttfa: "300ms", rtf: "0.50", mem: "50MB" },
  { m: "NeuTTS Air Q4", hw: "SD 8 Gen2", ttfa: "600ms", rtf: "0.80", mem: "500MB" },
  { m: "MeloTTS", hw: "2-core 2.4GHz", ttfa: "200ms", rtf: "0.50", mem: "200MB" },
  { m: "VibeVoice-RT", hw: "i7 CPU", ttfa: "300ms", rtf: "0.60", mem: "1.2GB" },
  { m: "Parler Mini", hw: "i7 CPU", ttfa: "900ms", rtf: "1.20", mem: "2GB" },
  { m: "XTTS-v2", hw: "i7 CPU", ttfa: "2.5s", rtf: "2.80", mem: "1.5GB" },
  { m: "F5-TTS", hw: "i7 CPU", ttfa: "4.0s", rtf: "3.50", mem: "1.2GB" },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
      const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    });
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".hero-title span", { y: 80, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power4.out", delay: 0.15 });
      gsap.from(".hero-sub", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.6 });
      gsap.from(".hero-cta", { y: 12, opacity: 0, duration: 0.6, delay: 0.8, ease: "power3.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <motion.div className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-fuchsia-500" style={{ scaleX: progressWidth, width: "100%" }} />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#08080a]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-zinc-900 text-[11px] font-bold tracking-widest text-amber-300">VC</div>
            </div>
            <span className="text-[13px] font-semibold tracking-[0.18em] text-zinc-100">VOICECRAFT</span>
            <span className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-widest text-zinc-400 md:inline">CPU • REALTIME</span>
          </div>
          <div className="hidden items-center gap-6 text-[12px] tracking-widest text-zinc-400 md:flex">
            <a href="#models" className="hover:text-white transition">MODELS</a>
            <a href="#stack" className="hover:text-white transition">STACK</a>
            <a href="#benchmarks" className="hover:text-white transition">BENCHMARKS</a>
            <a href="#sources" className="hover:text-white transition">SOURCES</a>
            <a href="#contact" className="rounded-full bg-white px-5 py-2 text-[12px] font-semibold tracking-widest text-zinc-900 hover:bg-zinc-100 transition">BOOK A DEMO</a>
          </div>
          <button onClick={() => setMobileNav((v) => !v)} className="text-zinc-300 md:hidden">{mobileNav ? "✕" : "☰"}</button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 bg-zinc-900 md:hidden">
              <div className="flex flex-col gap-4 px-6 py-6 text-sm tracking-widest text-zinc-300">
                <a href="#models" onClick={() => setMobileNav(false)}>MODELS</a>
                <a href="#stack" onClick={() => setMobileNav(false)}>STACK</a>
                <a href="#benchmarks" onClick={() => setMobileNav(false)}>BENCHMARKS</a>
                <a href="#sources" onClick={() => setMobileNav(false)}>SOURCES</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section ref={heroRef} className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-[#08080a] pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.07] via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(600px 400px at 70% 20%, rgba(245,158,11,0.18), transparent 60%), radial-gradient(700px 500px at 10% 80%, rgba(168,85,247,0.12), transparent 60%)" }} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[42vh] opacity-90">
          <Scene variant="hero" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-8">
          <div className="max-w-[760px]">
            <div className="hero-kicker inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-[0.18em] text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" /> RESEARCH • OCT 2026 • 8,118 MODELS SCANNED
            </div>
            <h1 className="hero-title mt-6 font-[var(--font-display)] text-[44px] font-normal leading-[0.9] tracking-[-0.03em] text-white md:text-[72px]">
              <span className="inline-block">Real-time</span> <span className="inline-block bg-gradient-to-r from-amber-300 via-orange-400 to-fuchsia-400 bg-clip-text text-transparent">voice agents</span>
              <span className="inline-block text-zinc-100"> on CPU.</span>
              <span className="inline-block text-zinc-500"> No GPU.</span>
            </h1>
            <p className="hero-sub mt-6 max-w-[560px] text-balance text-[16px] leading-7 text-zinc-400 md:text-[18px]">
              The definitive stack for low-latency conversational AI on low-grade servers. <span className="text-zinc-200">&lt;300ms end-to-end</span>, ONNX + GGUF, 60+ languages, emotion control — all on 2 vCPUs.
            </p>
            <div className="hero-cta mt-8 flex flex-wrap items-center gap-3">
              <a href="#models" className="rounded-full bg-white px-7 py-3 text-[13px] font-semibold tracking-widest text-zinc-900 hover:bg-zinc-100 transition">EXPLORE MODELS →</a>
              <a href="#stack" className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-[13px] font-semibold tracking-widest text-white backdrop-blur hover:bg-white/10 transition">VIEW STACK</a>
              <span className="ml-2 hidden items-center gap-2 text-xs tracking-widest text-zinc-500 md:inline-flex">
                <span className="h-px w-8 bg-white/20" /> SCROLL TO DIVE IN
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {["Piper <100ms", "Kokoro 82M", "VibeVoice 300ms", "ONNX • GGUF", "31 langs"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] tracking-widest text-zinc-400">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <motion.div style={{ y: yParallax }} className="pointer-events-none absolute right-[-2%] top-[18%] hidden h-[520px] w-[520px] opacity-60 md:block">
          <Scene variant="orb" />
        </motion.div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0c0c0e]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
          {[
            { k: "11.4M", v: "Kokoro downloads / mo", sub: "#1 trending TTS" },
            { k: "<150ms", v: "Piper TTFA", sub: "RPi-proven" },
            { k: "31", v: "Supertonic languages", sub: "CPU beats A100" },
            { k: "~500ms", v: "End-to-end TTFA", sub: "VAD→STT→LLM→TTS" },
          ].map((s) => (
            <div key={s.k} className="bg-[#0c0c0e] px-6 py-8 md:px-8 md:py-10">
              <div className="font-[var(--font-display)] text-3xl text-white md:text-4xl">{s.k}</div>
              <div className="mt-1 text-xs tracking-widest text-zinc-400">{s.v}</div>
              <div className="text-xs text-zinc-600">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="models" className="bg-[#08080a] py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.2em] text-amber-400">01 — THE SHORTLIST</div>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl leading-none tracking-tight text-white md:text-5xl">Five picks.<br /><span className="text-zinc-500">Zero GPU.</span></h2>
            </div>
            <p className="max-w-[420px] text-sm leading-6 text-zinc-400">Tap a card. Every model is ONNX or GGUF, streams, and hits realtime on 2 vCPUs. Data from 8,118 HF models + 7 GitHub repos.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {MODELS.map((m, i) => (
              <button key={m.id} onClick={() => setActive(i)} className={`group relative overflow-hidden rounded-2xl border p-[1px] text-left transition ${active === i ? "border-amber-400/50" : "border-white/10 hover:border-white/20"}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 transition group-hover:opacity-10 ${active === i ? "!opacity-[0.12]" : ""}`} />
                <div className="relative h-full rounded-[15px] bg-zinc-900 p-5">
                  <div className="text-[10px] tracking-[0.16em] text-amber-300">{m.tag}</div>
                  <div className="mt-2 font-semibold leading-tight text-white">{m.name}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <span className="rounded-full bg-white/5 px-2 py-1 text-zinc-400">{m.params}</span>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-zinc-400">{m.rtf} RTF</span>
                  </div>
                  <div className="mt-3 text-xs leading-5 text-zinc-400 line-clamp-3">{m.blurb}</div>
                  <div className="mt-4 text-[11px] tracking-widest text-white/60 group-hover:text-white">VIEW →</div>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: "easeOut" }} className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 md:p-8">
                  <div className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-widest text-zinc-900">{MODELS[active].tag}</div>
                  <h3 className="mt-4 font-[var(--font-display)] text-3xl text-white">{MODELS[active].name}</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-zinc-400">{MODELS[active].blurb} Licensed {MODELS[active].license}. {MODELS[active].langs}. Latency {MODELS[active].latency}.</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { k: "PARAMS", v: MODELS[active].params },
                      { k: "LATENCY", v: MODELS[active].latency },
                      { k: "RTF", v: MODELS[active].rtf },
                    ].map((x) => (
                      <div key={x.k} className="rounded-xl bg-white/[0.06] px-4 py-3">
                        <div className="text-[10px] tracking-widest text-zinc-500">{x.k}</div>
                        <div className="mt-1 text-sm font-semibold text-white">{x.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-zinc-300">HF: {MODELS[active].hf}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-zinc-300">GH: {MODELS[active].gh}</span>
                  </div>
                </div>
                <div className="relative min-h-[280px] border-t border-white/10 bg-[#0a0a0c] md:border-l md:border-t-0">
                  <div className="absolute inset-0 opacity-80">
                    <Scene variant="orb" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <div className="rounded-xl bg-white p-4 shadow-xl">
                      <div className="text-[11px] tracking-widest text-zinc-500">RECOMMENDED FOR</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-900">
                        {active === 0 ? "Low-grade VPS · Home Assistant · 1GB RAM" : active === 1 ? "Quality CPU agent · 2–4 vCPU" : active === 2 ? "Live narration · LLM streaming" : active === 3 ? "Phones · RPi · IoT" : "Multilingual · 31 langs"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="stack" className="border-y border-white/10 bg-[#0c0c0e] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          <div className="text-[11px] tracking-[0.2em] text-amber-400">02 — REFERENCE ARCHITECTURE</div>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl text-white md:text-5xl">VAD → STT → LLM → TTS</h2>
          <p className="mt-3 max-w-[640px] text-sm leading-6 text-zinc-400">All ONNX/GGUF. No cloud. Silero VAD gates STT, Zipformer streams, LLM tokens stream straight into TTS (VibeVoice pattern). ~500–700ms TTFA on 4-core CPU.</p>

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {[
              { n: "01", t: "Silero VAD", d: "ONNX, 1ms. Gates STT on silence.", c: "10ms" },
              { n: "02", t: "Sherpa-ONNX STT", d: "Zipformer 14–20M, RTF 0.1. Streaming.", c: "150ms" },
              { n: "03", t: "LLM Q4", d: "Qwen 0.5B / Gemma 1B via llama.cpp", c: "200ms first token" },
              { n: "04", t: "TTS (Piper/Kokoro)", d: "ONNX, chunked sentences, streamed", c: "150–300ms" },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
                <div className="text-xs tracking-widest text-amber-300">{s.n}</div>
                <div className="mt-2 font-semibold text-white">{s.t}</div>
                <div className="mt-1 text-sm leading-5 text-zinc-400">{s.d}</div>
                <div className="mt-4 inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-900">{s.c}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-zinc-900 p-6 md:grid-cols-3 md:p-8">
            <div>
              <div className="text-xs tracking-widest text-zinc-500">SERVER</div>
              <div className="mt-2 space-y-1 text-sm text-zinc-300">
                <div>Ultra-low: 1 vCPU · 512MB (Kitten/Piper)</div>
                <div>Recommended: 2 vCPU · 2–4GB (Kokoro/Supertonic)</div>
                <div>Streaming: 4 vCPU · 4–8GB (VibeVoice/NeuTTS)</div>
              </div>
            </div>
            <div>
              <div className="text-xs tracking-widest text-zinc-500">RUNTIME</div>
              <div className="mt-2 space-y-1 text-sm text-zinc-300">
                <div>ONNX Runtime — 2–3× vs PyTorch</div>
                <div>GGUF + llama.cpp — unified LLM+TTS</div>
                <div>Docker: sherpa-onnx · piper · coqui-tts-cpu</div>
              </div>
            </div>
            <div>
              <div className="text-xs tracking-widest text-zinc-500">FRAMEWORK</div>
              <div className="mt-2 text-sm text-zinc-300">LiveKit Agents (14.5k★) — WebRTC/SIP/MCP, pluggable STT/LLM/TTS. Pipecat alt.</div>
              <a href="#sources" className="mt-3 inline-block text-xs tracking-widest text-amber-300 hover:text-amber-200">SOURCES →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="benchmarks" className="bg-[#08080a] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-[0.2em] text-amber-400">03 — BENCHMARKS</div>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl text-white">Only Tier 1 hits <span className="text-amber-300">&lt;500ms</span></h2>
            </div>
            <div className="text-xs tracking-widest text-zinc-500">TTFA 20 WORDS · RTF · MEMORY</div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/[0.04] text-[11px] tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">MODEL</th>
                    <th className="px-4 py-3">HARDWARE</th>
                    <th className="px-4 py-3">TTFA</th>
                    <th className="px-4 py-3">RTF</th>
                    <th className="px-4 py-3">MEM</th>
                    <th className="px-4 py-3">VERDICT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {BENCH.map((r) => {
                    const ok = parseFloat(r.rtf) < 1;
                    return (
                      <tr key={r.m + r.hw} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium text-white">{r.m}</td>
                        <td className="px-4 py-3 text-zinc-400">{r.hw}</td>
                        <td className="px-4 py-3 text-zinc-200">{r.ttfa}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${ok ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>{r.rtf}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{r.mem}</td>
                        <td className={`px-4 py-3 text-xs font-semibold tracking-widest ${ok ? "text-emerald-300" : "text-red-300"}`}>{ok ? "REALTIME" : "GPU ONLY"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">Source: OHF-Voice docs, Rhasspy benchmarks, Hexgrad HF, Supertonic paper Fig (CPU vs A100), KittenML, MyShell, Microsoft card, Coqui community, SWivid issues.</p>
        </div>
      </section>

      <section id="sources" className="border-y border-white/10 bg-[#0c0c0e] py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          <div className="text-[11px] tracking-[0.2em] text-amber-400">04 — SOURCES</div>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl text-white">Every link. No hallucinations.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <div className="text-xs tracking-widest text-zinc-500">HUGGING FACE</div>
              <ul className="mt-3 space-y-1.5 text-sm leading-5 text-zinc-400">
                <li><a className="hover:text-white" href="https://huggingface.co/hexgrad/Kokoro-82M">hexgrad/Kokoro-82M</a></li>
                <li><a className="hover:text-white" href="https://huggingface.co/Supertone/supertonic-3">Supertone/supertonic-3</a></li>
                <li><a className="hover:text-white" href="https://huggingface.co/KittenML/kitten-tts-nano-0.1">KittenML/kitten-tts-nano-0.1</a></li>
                <li><a className="hover:text-white" href="https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B">microsoft/VibeVoice-Realtime-0.5B</a></li>
                <li><a className="hover:text-white" href="https://huggingface.co/myshell-ai/MeloTTS-English">myshell-ai/MeloTTS-English</a></li>
                <li><a className="hover:text-white" href="https://huggingface.co/neuphonic/neutts-air">neuphonic/neutts-air</a></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <div className="text-xs tracking-widest text-zinc-500">GITHUB</div>
              <ul className="mt-3 space-y-1.5 text-sm leading-5 text-zinc-400">
                <li><a className="hover:text-white" href="https://github.com/OHF-Voice/piper1-gpl">OHF-Voice/piper1-gpl</a> · <a className="hover:text-white" href="https://github.com/k2-fsa/sherpa-onnx">k2-fsa/sherpa-onnx</a></li>
                <li><a className="hover:text-white" href="https://github.com/hexgrad/kokoro">hexgrad/kokoro</a> · <a className="hover:text-white" href="https://github.com/livekit/agents">livekit/agents</a></li>
                <li><a className="hover:text-white" href="https://github.com/myshell-ai/MeloTTS">myshell-ai/MeloTTS</a> · <a className="hover:text-white" href="https://github.com/snakers4/silero-vad">snakers4/silero-vad</a></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <div className="text-xs tracking-widest text-zinc-500">PAPERS</div>
              <ul className="mt-3 space-y-1.5 text-sm leading-5 text-zinc-400">
                <li><a className="hover:text-white" href="https://arxiv.org/abs/2306.07691">StyleTTS2</a> · <a className="hover:text-white" href="https://arxiv.org/abs/2203.02395">ISTFTNet</a></li>
                <li><a className="hover:text-white" href="https://arxiv.org/abs/2508.19205">VibeVoice Tech Report</a></li>
                <li><a className="hover:text-white" href="https://arxiv.org/abs/2402.01912">Parler-TTS</a> · <a className="hover:text-white" href="https://arxiv.org/abs/2410.06885">F5-TTS</a></li>
              </ul>
              <div className="mt-4 text-xs text-zinc-500">Full vault: Obsidian MOC → Voice Agent Sources</div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#08080a] py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="text-sm text-zinc-500">© 2026 VoiceCraft Research • Built from Obsidian vault • Data fetched live, no URLs guessed.</div>
          <div className="flex gap-3">
            <a href="#models" className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold tracking-widest text-zinc-900">START PRESENTATION</a>
            <a href="https://github.com" className="rounded-full border border-white/10 px-6 py-2.5 text-xs tracking-widest text-zinc-300">GITHUB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
