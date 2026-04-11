import React from "react";
import {
  Code2,
  Terminal,
  Layers,
  Box,
  ChevronRight,
  Check,
  Copy,
  Info,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-neutral-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold tracking-widest text-pink-600 uppercase">
              <BookOpen className="size-3" />
              Documentation
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
              Integrate <span className="text-pink-600">KudosWall</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-neutral-500">
              Everything you need to add social proof to your website. From simple HTML to
              enterprise React apps.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* ─── Main Content ──────────────────────────────────────────────── */}
          <main className="space-y-24">
            {/* 1. HTML / Vanilla */}
            <section id="vanilla" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Terminal className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">HTML & Vanilla JavaScript</h2>
                  <p className="text-neutral-500">
                    The Zero-Code approach. Perfect for static sites.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-neutral-600">
                  Simply paste this snippet before the closing <code>&lt;/body&gt;</code> tag or
                  inside your content area.
                </p>
                <div className="relative overflow-hidden rounded-[24px] bg-neutral-900 p-8 shadow-2xl">
                  <code className="block font-mono text-sm leading-loose text-pink-300">
                    {`<script \n  src="https://kudoswall.org/widget.js" \n  data-id="YOUR_WIDGET_ID" \n  async\n></script>`}
                  </code>
                </div>
                <div className="rounded-2xl border border-blue-50 bg-blue-50/30 p-4">
                  <div className="flex gap-3">
                    <Info className="size-5 shrink-0 text-blue-500" />
                    <p className="text-[13px] text-blue-700">
                      <strong>Pro-tip:</strong> You can override your dashboard settings by adding
                      attributes like <code>data-theme="dark"</code> or{" "}
                      <code>data-layout="carousel"</code>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. React / Next.js */}
            <section id="react" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Code2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">React & Next.js</h2>
                  <p className="text-neutral-500">
                    Safely integrated into your component lifecycle.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-neutral-600">
                  To avoid hydration mismatches, inject the script using a <code>useEffect</code>{" "}
                  hook.
                </p>
                <div className="relative overflow-hidden rounded-[24px] bg-neutral-900 p-8 shadow-2xl">
                  <pre className="overflow-auto font-mono text-sm leading-loose text-blue-300">
                    {`"use client";
import { useEffect, useRef } from "react";

export default function WallOfLove() {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kudoswall.org/widget.js";
    script.setAttribute("data-id", "YOUR_WIDGET_ID");
    script.async = true;
    containerRef.current?.appendChild(script);
  }, []);

  return <div ref={containerRef} className="w-full" />;
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* 3. Vue / nuxt */}
            <section id="vue" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Layers className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Vue & Nuxt</h2>
                  <p className="text-neutral-500">Native integration with Vue's composition API.</p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-neutral-600">
                  Use the <code>onMounted</code> hook to attach the script to your template.
                </p>
                <div className="relative overflow-hidden rounded-[24px] bg-neutral-900 p-8 shadow-2xl">
                  <pre className="overflow-auto font-mono text-sm leading-loose text-emerald-300">
                    {`<script setup>
import { onMounted, ref } from 'vue';

const widgetContainer = ref(null);

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://kudoswall.org/widget.js';
  script.setAttribute('data-id', 'YOUR_WIDGET_ID');
  script.async = true;
  widgetContainer.value.appendChild(script);
});
</script>

<template>
  <div ref="widgetContainer"></div>
</template>`}
                  </pre>
                </div>
              </div>
            </section>

            {/* 4. No-Code */}
            <section id="nocode" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Box className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">No-Code Hub</h2>
                  <p className="text-neutral-500">Webflow, Shopify, Framer, and more.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Webflow", steps: "Add 'Embed' block, paste script." },
                  { name: "Shopify", steps: "Add 'Custom HTML' section, paste script." },
                  { name: "Framer", steps: "Add 'Embed' component, paste script." },
                  { name: "Wix", steps: "Add 'Embed HTML' element, paste script." },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="rounded-2xl border border-neutral-100 p-6 transition-all hover:bg-neutral-50"
                  >
                    <h4 className="font-bold text-neutral-900">{p.name}</h4>
                    <p className="mt-1 text-sm text-neutral-500">{p.steps}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* ─── Sidebar Navigation ────────────────────────────────────────── */}
          <aside className="sticky top-24 h-fit space-y-8">
            <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Jump To
              </h4>
              <nav className="flex flex-col gap-3">
                {[
                  { id: "vanilla", name: "HTML / Vanilla" },
                  { id: "react", name: "React / Next.js" },
                  { id: "vue", name: "Vue / Nuxt" },
                  { id: "nocode", name: "No-Code Apps" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="group flex items-center justify-between text-[14px] font-medium text-neutral-600 transition-all hover:text-pink-600"
                  >
                    {item.name}
                    <ChevronRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </a>
                ))}
              </nav>
            </div>

            <div className="rounded-3xl bg-pink-600 p-6 text-white shadow-xl shadow-pink-100">
              <h4 className="font-bold">Need a custom fix?</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-pink-100">
                Our team can help you integrate KudosWall into any custom stack.
              </p>
              <button className="mt-4 flex items-center gap-2 text-[13px] font-bold text-white transition-all hover:gap-3">
                Contact Support <ChevronRight className="size-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
