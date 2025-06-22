'use client';

import { useMemo } from 'react';
import type { Post } from '@/types/post';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface JournalCalendarProps {
  posts: Post[];
}

export function JournalCalendar({ posts }: JournalCalendarProps) {
  const postDates = useMemo(() => {
    return posts.map(post => new Date(post.createdAt));
  }, [posts]);

  // The modifiers for react-day-picker
  const modifiers = {
    posted: postDates,
  };

  // The styles for the 'posted' modifier
  const modifiersStyles = {
    posted: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Activity Calendar</CardTitle>
        <CardDescription>Days with a journal entry are highlighted.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="p-0"
        />
      </CardContent>
    </Card>
  );
}
