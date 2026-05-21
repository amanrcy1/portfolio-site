export type BlogCategory = 'tool-comparisons' | 'lessons-learned' | 'war-stories';

export interface BlogPost {
  slug: string;
  title: string;
  publishedDate: string;
  readingTimeMinutes: number;
  category: BlogCategory;
  content: string;
}
