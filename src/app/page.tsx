import { getPosts } from '@/app/actions/posts';
import { PostCard } from '@/components/posts/post-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-headline font-bold">All Posts</h1>
        {/* Create button is in header, this can be removed or kept for prominence */}
        {/* 
        <Button asChild>
          <Link href="/posts/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Post
          </Link>
        </Button> 
        */}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No posts yet!</h2>
          <p className="text-muted-foreground mb-6">Be the first one to share your thoughts.</p>
          <Button asChild size="lg">
            <Link href="/posts/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
