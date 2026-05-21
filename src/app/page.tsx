import HeroSection from '@/components/about/HeroSection';
import VideoEmbed from '@/components/about/VideoEmbed';
import { ScrollReveal } from '@/components/animations';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-12">
      <HeroSection />
      <ScrollReveal variant="slide-up" threshold={0.2}>
        <section className="w-full py-12">
          <h2 className="text-2xl font-heading font-semibold text-brand-text text-center mb-8">
            Video Introduction
          </h2>
          <VideoEmbed videoId="dQw4w9WgXcQ" title="QA Engineer Introduction" />
        </section>
      </ScrollReveal>
    </main>
  );
}
