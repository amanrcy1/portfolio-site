import { getAllBlogPosts } from '@/lib/content-loader';
import CategoryFilter from '@/components/blog/CategoryFilter';
import { ScrollReveal } from '@/components/animations';

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const postItems = posts.map((post) => ({
    slug: post.frontmatter.slug,
    title: post.frontmatter.title,
    publishedDate: post.frontmatter.publishedDate,
    readingTimeMinutes: post.frontmatter.readingTimeMinutes,
    category: post.frontmatter.category,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade" threshold={0.2}>
        <div className="mb-12">
          <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-brand-text/70">
            Technical articles on QA engineering — tool comparisons, lessons
            learned, and stories from the trenches.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="slide-up" threshold={0.2}>
        <CategoryFilter posts={postItems} />
      </ScrollReveal>
    </div>
  );
}
