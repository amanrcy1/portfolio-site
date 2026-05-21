import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogCategory, BlogPost } from '@/types/blog';

export interface CaseStudyFrontmatter {
  title: string;
  slug: string;
  summary: string;
  primaryMetric: {
    label: string;
    before: string;
    after: string;
    unit: string;
  };
  toolsUsed: string[];
  repoUrl: string;
  publishedDate: string;
}

export interface CaseStudyData {
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

const CASE_STUDIES_DIR = path.join(process.cwd(), 'src/content/case-studies');

/**
 * Get all case study slugs for static path generation.
 */
export function getCaseStudySlugs(): string[] {
  const files = fs.readdirSync(CASE_STUDIES_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get all case studies with their frontmatter (for listing page).
 */
export function getAllCaseStudies(): CaseStudyData[] {
  const files = fs.readdirSync(CASE_STUDIES_DIR);
  const caseStudies = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(CASE_STUDIES_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      return {
        frontmatter: data as CaseStudyFrontmatter,
        content,
      };
    });

  // Sort by publishedDate descending
  caseStudies.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedDate).getTime() -
      new Date(a.frontmatter.publishedDate).getTime()
  );

  return caseStudies;
}

/**
 * Get a single case study by slug.
 */
export function getCaseStudyBySlug(slug: string): CaseStudyData | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    frontmatter: data as CaseStudyFrontmatter,
    content,
  };
}

// ─── Blog Content Loading ────────────────────────────────────────────────────

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface BlogPostData {
  frontmatter: {
    title: string;
    slug: string;
    publishedDate: string;
    readingTimeMinutes: number;
    category: BlogCategory;
  };
  content: string;
}

/**
 * Get all blog post slugs for static path generation.
 */
export function getBlogPostSlugs(): string[] {
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get all blog posts with their frontmatter (for listing page).
 */
export function getAllBlogPosts(): BlogPostData[] {
  const files = fs.readdirSync(BLOG_DIR);
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      return {
        frontmatter: data as BlogPostData['frontmatter'],
        content,
      };
    });

  // Sort by publishedDate descending
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedDate).getTime() -
      new Date(a.frontmatter.publishedDate).getTime()
  );

  return posts;
}

/**
 * Get a single blog post by slug.
 */
export function getBlogPostBySlug(slug: string): BlogPostData | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    frontmatter: data as BlogPostData['frontmatter'],
    content,
  };
}
