import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
export class Comment {
@PrimaryColumn('uuid')
id: string;

@Column({ type: 'text', nullable: false })
content: string;

@CreateDateColumn()
createdAt: Date;

    static createComment(postId: string, content: string, userId: string, userLogin: string): Comment {
        const comment = new Comment();

        comment.id = randomUUID();//
        comment.content = content;//
        comment.createdAt = new Date();//

        return comment;
    }
}