import { getAllCaseStudies } from '@/lib/content-loader';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';
import RepoLink from '@/components/shared/RepoLink';
import { ScrollReveal, StaggerContainer } from '@/components/animations';

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade" threshold={0.2}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
              Case Studies
            </h1>
            <p className="mt-4 text-lg text-brand-text/70">
              Explore detailed case studies showcasing real-world QA engineering
              challenges, approaches, and measurable outcomes.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <StaggerContainer staggerDelay={0.1} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {caseStudies.map((study) => (
          <ScrollReveal key={study.frontmatter.slug} variant="slide-up" threshold={0.2}>
            <CaseStudyCard
              slug={study.frontmatter.slug}
              title={study.frontmatter.title}
              summary={study.frontmatter.summary}
              primaryMetric={study.frontmatter.primaryMetric}
            />
          </ScrollReveal>
        ))}
      </StaggerContainer>
    </div>
  );
}
