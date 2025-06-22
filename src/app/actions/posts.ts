'use server';

import type { Post, PostFormData } from '@/types/post';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file that acts as our database
const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');

// Helper function to read posts from the file
async function readPostsFromFile(): Promise<Post[]> {
  try {
    const fileContent = await fs.readFile(postsFilePath, 'utf-8');
    const posts = JSON.parse(fileContent);
    // Convert date strings back to Date objects
    return posts.map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error: any) {
    // If the file doesn't exist or is empty, initialize it
    if (error.code === 'ENOENT') {
      await writePostsToFile([]); // Create the file with an empty array
      return [];
    }
    console.error('Failed to read posts from file:', error);
    return [];
  }
}

// Helper function to write posts to the file
async function writePostsToFile(posts: Post[]): Promise<void> {
  try {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(postsFilePath), { recursive: true });
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write posts to file:', error);
    throw new Error('Could not save posts.');
  }
}


export async function getPosts(): Promise<Post[]> {
  const posts = await readPostsFromFile();
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await readPostsFromFile();
  return posts.find(post => post.id === id);
}

export async function createPost(data: PostFormData): Promise<Post> {
  const posts = await readPostsFromFile();
  const newPost: Post = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const updatedPosts = [newPost, ...posts]; // Add to the beginning
  await writePostsToFile(updatedPosts);
  
  revalidatePath('/');
  revalidatePath(`/posts/create`);
  revalidatePath(`/posts/${newPost.id}/edit`);
  return newPost;
}

export async function updatePost(id: string, data: PostFormData): Promise<Post | null> {
  const posts = await readPostsFromFile();
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return null;
  }
  
  const updatedPost: Post = {
    ...posts[postIndex],
    ...data,
    updatedAt: new Date(),
  };
  posts[postIndex] = updatedPost;
  
  await writePostsToFile(posts);
  revalidatePath('/');
  revalidatePath(`/posts/${id}/edit`);
  return updatedPost;
}

export async function deletePost(id: string): Promise<void> {
  const posts = await readPostsFromFile();
  const updatedPosts = posts.filter(post => post.id !== id);
  
  if (posts.length === updatedPosts.length) {
    // Post not found, maybe throw an error or just do nothing
    return;
  }
  
  await writePostsToFile(updatedPosts);
  revalidatePath('/');
}
