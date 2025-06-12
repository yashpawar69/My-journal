'use client';

import type * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TagInput } from './tag-input';
import { suggestTags } from '@/ai/flows/suggest-tags';
import type { Post, PostFormData } from '@/types/post';
import { DEBOUNCE_DELAY } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
});

interface PostFormProps {
  initialData?: Post | null;
  onSubmit: (data: PostFormData) => Promise<any>;
  isEditing?: boolean;
}

export function PostForm({ initialData, onSubmit, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || { title: '', content: '', tags: [] },
  });

  const [suggestedAITags, setSuggestedAITags] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const currentContent = watch('content');
  const currentTags = watch('tags');

  const debouncedSuggestTags = useMemo(() => {
    const executeSuggestTags = async (content: string) => {
      if (content.trim().length < 50) { // Only suggest if content is substantial
        setSuggestedAITags([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const result = await suggestTags({ postContent: content });
        setSuggestedAITags(result.tags.filter(tag => !currentTags.includes(tag)));
      } catch (error) {
        console.error('Error fetching AI tag suggestions:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch AI tag suggestions.',
          variant: 'destructive',
        });
        setSuggestedAITags([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    // Basic debounce implementation
    let timeoutId: NodeJS.Timeout;
    return (content: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => executeSuggestTags(content), DEBOUNCE_DELAY);
    };
  }, [currentTags, toast]);

  useEffect(() => {
    if (currentContent) {
      debouncedSuggestTags(currentContent);
    }
  }, [currentContent, debouncedSuggestTags]);
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<PostFormData> = async (data) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success!',
        description: `Post ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      // Navigation is handled by server action's redirect
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} post.`,
        variant: 'destructive',
      });
    }
  };

  const handleTagsChange = useCallback((newTags: string[]) => {
    setValue('tags', newTags, { shouldValidate: true });
    // Re-filter AI suggestions based on new current tags
    setSuggestedAITags(prev => prev.filter(tag => !newTags.includes(tag)));
  }, [setValue]);

  const handleAddSuggestedTag = useCallback((tag: string) => {
     if (!currentTags.includes(tag)) {
        const newTags = [...currentTags, tag];
        handleTagsChange(newTags);
     }
  },[currentTags, handleTagsChange]);


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg">Title</Label>
            <Input
              id="title"
              {...register('title')}
              className="mt-1 text-base"
              placeholder="Enter your post title"
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="content" className="text-lg">Content</Label>
            <Textarea
              id="content"
              {...register('content')}
              rows={15}
              className="mt-1 text-base min-h-[300px]"
              placeholder="Write your blog post here..."
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <Label htmlFor="tags" className="text-lg">Tags</Label>
            <TagInput
              value={currentTags}
              onChange={handleTagsChange}
              suggestedTags={suggestedAITags}
              onAddSuggestedTag={handleAddSuggestedTag}
              isLoadingSuggestions={isLoadingSuggestions}
            />
            {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
