import { getPosts } from '@/app/actions/posts';
import { JournalCalendar } from '@/components/posts/journal-calendar';
import { PostList } from '@/components/posts/post-list';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="space-y-12">
      <JournalCalendar posts={posts} />
      <PostList posts={posts} />
    </div>
  );
}
