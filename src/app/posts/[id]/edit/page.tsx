import { PostForm } from '@/components/posts/post-form';
import { getPost, updatePost } from '@/app/actions/posts';
import { notFound } from 'next/navigation';
import type { PostFormData } from '@/types/post';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const handleUpdatePost = async (data: PostFormData) => {
    "use server";
    return updatePost(params.id, data);
  };

  return (
    <div>
      <PostForm initialData={post} onSubmit={handleUpdatePost} isEditing={true} />
    </div>
  );
}
