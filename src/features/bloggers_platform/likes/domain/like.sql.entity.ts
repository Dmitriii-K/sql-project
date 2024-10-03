import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';

@Entity()
export class Like {
    @PrimaryColumn('uuid')
    id: string;

    @CreateDateColumn()
    addedAt: Date;

    @Column({ type: 'varchar', nullable: false })
    commentId: string;

    @Column({ type: 'varchar', nullable: false })
    userId: string;

    @Column({ type: 'varchar', nullable: false })
    userLogin: string;

    @Column({ type: 'enum', enum: likeStatus, nullable: false, default: likeStatus.None })
    status: likeStatus;

    static createLike(commentId: string, userId: string, userLogin: string, status: likeStatus): Like {
        const like = new Like();

        like.id = randomUUID();
        like.addedAt = new Date();
        like.commentId = commentId;
        like.userId = userId;
        like.userLogin = userLogin;
        like.status = status || likeStatus.None;

        return like;
    }
}