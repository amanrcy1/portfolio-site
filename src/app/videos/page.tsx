import VideoCard from '@/components/videos/VideoCard';
import { ScrollReveal, StaggerContainer } from '@/components/animations';

export const metadata = {
  title: 'Video Library | QA Engineer Portfolio',
  description:
    'Watch technical videos on exploratory testing, self-healing locators, and test framework architecture.',
};

const videos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'My framework architecture explained',
    duration: '3 min',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'How I approach exploratory testing',
    duration: '5 min',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Building a self-healing test locator',
    duration: '8 min',
  },
];

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade" threshold={0.2}>
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-heading font-bold text-brand-text mb-4">
            Video Library
          </h1>
          <p className="text-lg text-brand-text/70 max-w-2xl mx-auto">
            Short technical videos covering testing approaches, framework walkthroughs, and
            quality engineering concepts.
          </p>
        </header>
      </ScrollReveal>

      <StaggerContainer staggerDelay={0.1} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <ScrollReveal key={video.title} variant="slide-up" threshold={0.2}>
            <VideoCard
              videoId={video.id}
              title={video.title}
              duration={video.duration}
            />
          </ScrollReveal>
        ))}
      </StaggerContainer>
    </div>
  );
}
