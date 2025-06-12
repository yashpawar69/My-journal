import { PostForm } from '@/components/posts/post-form';
import { createPost } from '@/app/actions/posts';

export default function CreatePostPage() {
  return (
    <div>
      <PostForm onSubmit={createPost} isEditing={false} />
    </div>
  );
}
