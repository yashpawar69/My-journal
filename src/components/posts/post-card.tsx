import Link from 'next/link';
import type { Post } from '@/types/post';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FilePenLine, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { PostCardActions } from './post-card-actions';
import { MAX_POST_CONTENT_PREVIEW_LENGTH } from '@/lib/constants';
import { PostAudioPlayer } from './post-audio-player';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const excerpt = post.content.length > MAX_POST_CONTENT_PREVIEW_LENGTH 
    ? `${post.content.substring(0, MAX_POST_CONTENT_PREVIEW_LENGTH)}...`
    : post.content;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-2xl mb-2">
          <Link href={`/posts/${post.id}/edit`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          <span>Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          {post.updatedAt.getTime() !== post.createdAt.getTime() && (
            <span suppressHydrationWarning className="ml-2">(Edited: {format(new Date(post.updatedAt), 'MMM d, HH:mm')})</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base line-clamp-3">{excerpt}</CardDescription>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.slice(0, 5).map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {post.tags.length > 5 && <Badge variant="outline">+{post.tags.length - 5} more</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4 border-t pt-4">
        <PostAudioPlayer postContent={post.content} />
        <div className="flex justify-end gap-2">
          <PostCardActions postId={post.id} postTitle={post.title} />
          <Button asChild variant="outline">
            <Link href={`/posts/${post.id}/edit`}>
              <FilePenLine className="mr-2 h-5 w-5" />
              Edit
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
