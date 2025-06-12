'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { deletePost } from '@/app/actions/posts';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostCardActionsProps {
  postId: string;
  postTitle: string;
}

export function PostCardActions({ postId, postTitle }: PostCardActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(postId);
      toast({
        title: 'Post Deleted',
        description: `"${postTitle}" has been deleted.`,
      });
      router.refresh(); // Re-fetch posts on the current page
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the post.',
        variant: 'destructive',
      });
    } finally {
      setIsConfirmOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete post"
      >
        <Trash2 className="h-5 w-5 text-destructive" />
      </Button>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        description={`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
      />
    </>
  );
}
