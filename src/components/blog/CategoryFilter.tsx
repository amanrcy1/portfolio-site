'use client';

import { useState } from 'react';
import { BlogCategory } from '@/types/blog';
import BlogCard from './BlogCard';

interface BlogPostItem {
  slug: string;
  title: string;
  publishedDate: string;
  readingTimeMinutes: number;
  category: BlogCategory;
}

interface CategoryFilterProps {
  posts: BlogPostItem[];
}

type FilterValue = 'all' | BlogCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tool-comparisons', label: 'Tool Comparisons' },
  { value: 'lessons-learned', label: 'Lessons Learned' },
  { value: 'war-stories', label: 'War Stories' },
];

export default function CategoryFilter({ posts }: CategoryFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filteredPosts =
    activeFilter === 'all'
      ? posts
      : posts.filter((post) => post.category === activeFilter);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface text-brand-text/70 hover:bg-brand-surface/80 hover:text-brand-text'
            }`}
            aria-pressed={activeFilter === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            publishedDate={post.publishedDate}
            readingTimeMinutes={post.readingTimeMinutes}
            category={post.category}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-brand-text/50 py-8">
          No articles found for this category.
        </p>
      )}
    </div>
  );
}
