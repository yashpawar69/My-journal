'use server';

import type { Post, PostFormData } from '@/types/post';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import PostModel from '@/models/post';
import { isValidObjectId } from 'mongoose';

/**
 * Converts a Mongoose document to a plain JavaScript object
 * that matches the `Post` type.
 * @param doc A Mongoose document.
 * @returns A plain object.
 */
function serializePost(doc: any): Post {
  const post = JSON.parse(JSON.stringify(doc));
  return {
    ...post,
    id: post._id.toString(),
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };
}

export async function getPosts(): Promise<Post[]> {
  try {
    await dbConnect();
    const postDocs = await PostModel.find({}).sort({ createdAt: -1 });
    return postDocs.map(serializePost);
  } catch (error) {
    console.error('Database error (getPosts):', error);
    throw new Error('Failed to fetch posts.');
  }
}

export async function getPost(id: string): Promise<Post | undefined> {
    if (!isValidObjectId(id)) {
        return undefined;
    }
  try {
    await dbConnect();
    const postDoc = await PostModel.findById(id);
    if (!postDoc) return undefined;
    return serializePost(postDoc);
  } catch (error) {
    console.error(`Database error (getPost: ${id}):`, error);
    throw new Error('Failed to fetch post.');
  }
}

export async function createPost(data: PostFormData): Promise<Post> {
  try {
    await dbConnect();
    const newPostDoc = await PostModel.create(data);
    
    // Revalidate paths to ensure fresh data is shown
    revalidatePath('/');
    revalidatePath('/posts/create');

    return serializePost(newPostDoc);
  } catch (error) {
    console.error('Database error (createPost):', error);
    throw new Error('Failed to create post.');
  }
}

export async function updatePost(id: string, data: PostFormData): Promise<Post | null> {
    if (!isValidObjectId(id)) {
        return null;
    }
  try {
    await dbConnect();
    const updatedPostDoc = await PostModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedPostDoc) {
      return null;
    }

    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath(`/posts/${id}/edit`);

    return serializePost(updatedPostDoc);
  } catch (error) {
    console.error(`Database error (updatePost: ${id}):`, error);
    throw new Error('Failed to update post.');
  }
}

export async function deletePost(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
        return;
    }
  try {
    await dbConnect();
    await PostModel.findByIdAndDelete(id);
    
    // Revalidate home page to reflect deletion
    revalidatePath('/');
  } catch (error) {
    console.error(`Database error (deletePost: ${id}):`, error);
    throw new Error('Failed to delete post.');
  }
}
