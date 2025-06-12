export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PostFormData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
