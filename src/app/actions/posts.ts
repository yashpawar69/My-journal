'use server';

import type { Post, PostFormData } from '@/types/post';
import { revalidatePath } from 'next/cache';

// In-memory store for posts
let posts: Post[] = [
  {
    id: '1',
    title: 'My First Blog Post',
    content: 'This is the content of my very first blog post. I am excited to share my thoughts with the world. It covers various topics including technology, life, and coding.',
    tags: ['introduction', 'blogging', 'tech'],
    createdAt: new Date('2023-10-01T10:00:00Z'),
    updatedAt: new Date('2023-10-01T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Exploring Next.js 14',
    content: 'Next.js 14 has brought some amazing features, including improved server actions and app router capabilities. This post delves into how these can be leveraged for modern web development.',
    tags: ['nextjs', 'webdev', 'javascript', 'react'],
    createdAt: new Date('2023-10-15T14:30:00Z'),
    updatedAt: new Date('2023-10-16T09:15:00Z'),
  },
];

export async function getPosts(): Promise<Post[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPost(id: string): Promise<Post | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.find(post => post.id === id);
}

export async function createPost(data: PostFormData): Promise<Post> {
  const newPost: Post = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.unshift(newPost); // Add to the beginning of the array
  revalidatePath('/');
  revalidatePath(`/posts/${newPost.id}/edit`);
  return newPost;
}

export async function updatePost(id: string, data: PostFormData): Promise<Post | null> {
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return null;
  }
  const updatedPost = {
    ...posts[postIndex],
    ...data,
    updatedAt: new Date(),
  };
  posts[postIndex] = updatedPost;
  revalidatePath('/');
  revalidatePath(`/posts/${id}/edit`);
  return updatedPost;
}

export async function deletePost(id: string): Promise<void> {
  posts = posts.filter(post => post.id !== id);
  revalidatePath('/');
}
