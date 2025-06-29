import mongoose, { Schema, models, model } from 'mongoose';
import type { Post as PostType } from '@/types/post';

// The Post type from src/types/post.ts is for the client-side.
// The Mongoose document can have a slightly different structure (_id instead of id).
export interface IPost extends Omit<PostType, 'id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.'],
  },
  tags: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

// Using models.Post to prevent overwriting the model in Next.js hot-reloading
export default models.Post as mongoose.Model<IPost> || model<IPost>('Post', PostSchema);
