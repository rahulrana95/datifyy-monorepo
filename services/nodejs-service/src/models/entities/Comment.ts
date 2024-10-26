import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Comment_pkey", ["id"], { unique: true })
@Entity("Comment", { schema: "public" })
export class Comment {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "content", length: 255 })
  content: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("integer", { name: "postId" })
  postId: number;

  @Column("integer", { name: "userId" })
  userId: number;

  @Column("integer", { name: "upvotes", default: () => "0" })
  upvotes: number;

  @Column("integer", { name: "downvotes", default: () => "0" })
  downvotes: number;
}
