'use client';

import { useState, useMemo } from 'react';
import type { Post } from '@/types/post';
import { PostCard } from '@/components/posts/post-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return posts;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.content.toLowerCase().includes(lowercasedQuery)
    );
  }, [posts, searchQuery]);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <h1 className="text-4xl font-headline font-bold mb-8">All Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <h2 className="text-2xl font-semibold mb-4">No posts yet!</h2>
          <p className="text-muted-foreground mb-6">Be the first one to share your thoughts.</p>
          <Button asChild size="lg">
            <Link href="/posts/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Post
            </Link>
          </Button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <h2 className="text-2xl font-semibold mb-4">No Posts Found</h2>
          <p className="text-muted-foreground">Your search for "{searchQuery}" did not match any posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
