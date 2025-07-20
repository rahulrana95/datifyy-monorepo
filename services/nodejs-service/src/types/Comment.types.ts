/**
 * Comment Type
 * Auto-generated from TypeORM entity: Comment
 */

export interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  userId: number;
  upvotes: number;
  downvotes: number;
}

// Utility types for Comment
export type CreateCommentInput = Omit<CommentType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCommentInput = Partial<Omit<CommentType, 'id' | 'createdAt' | 'updatedAt'>>;
export type CommentId = CommentType['id'];
