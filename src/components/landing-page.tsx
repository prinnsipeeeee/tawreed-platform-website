"use client";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Acts from "./Acts";
import Crew from "./Crew";
import Scenes from "./Scenes";
import Demo from "./Demo";
import Model from "./Model";
import Closing from "./Closing";
import Footer from "./Footer";
import { LandingProvider } from "./landing-context";
import type { LandingData } from "@/lib/content";
const sections: Record<string, React.ComponentType> = {
  hero: Hero,
  acts: Acts,
  crew: Crew,
  scenes: Scenes,
  demo: Demo,
  model: Model,
  closing: Closing,
};
export function LandingPage({
  data,
  locale,
}: {
  data: LandingData;
  locale: "en" | "ar";
}) {
  return (
    <LandingProvider data={data} locale={locale}>
      <div className="min-h-screen bg-[#0b0c0a] text-[#f4efe3] selection:bg-[#d9a441] selection:text-[#0b0c0a] overflow-x-hidden">
        <Navbar />
        <main className="relative">
          {data.sections
            .filter((s) => s.visible && sections[s.key])
            .map((s) => {
              const Section = sections[s.key];
              return <Section key={s.key} />;
            })}
        </main>
        <Footer />
      </div>
    </LandingProvider>
  );
}
