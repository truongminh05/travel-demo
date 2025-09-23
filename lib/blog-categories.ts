// lib/blog-categories.ts
export const BLOG_CATEGORIES = [
  "Mẹo du lịch",
  "Điểm đến nổi bật",
  "Cẩm nang theo mùa",
  "Du lịch gia đình",
  "Du lịch bền vững",
  "Nhiếp ảnh",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
