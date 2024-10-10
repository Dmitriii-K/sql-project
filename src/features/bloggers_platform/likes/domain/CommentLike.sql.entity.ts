import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { likeStatus } from '../api/models/input.model';
import { randomUUID } from 'crypto';

@Entity()
export class Like {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: likeStatus, nullable: false, default: likeStatus.None })
    status: likeStatus;

    @Column({ type: 'uuid', nullable: false })
    userId: string;

    @CreateDateColumn()
    addedAt: Date;

    static createLike(userId: string, status: likeStatus): Like {
        const like = new Like();

        like.id = randomUUID();
        like.status = status || likeStatus.None;
        like.userId = userId,
        like.addedAt = new Date();

        return like;
    }
}