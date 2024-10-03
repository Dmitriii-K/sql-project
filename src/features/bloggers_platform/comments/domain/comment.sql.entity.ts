import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity()
class CommentatorInfo {
@Column({ type: 'varchar', nullable: false })
userId: string;

@Column({ type: 'varchar', nullable: false })
userLogin: string;
}

@Entity()
class LikesCount {
@Column({ type: 'int', nullable: false, default: 0 })
likesCount: number;

@Column({ type: 'int', nullable: false, default: 0 })
dislikesCount: number;
}

@Entity()
export class Comment {
@PrimaryColumn('uuid')
id: string;

@Column({ type: 'varchar', nullable: false })
postId: string;

@Column({ type: 'text', nullable: false })
content: string;

@CreateDateColumn()
createdAt: Date;

@Column(() => CommentatorInfo)
commentatorInfo: CommentatorInfo;

@Column(() => LikesCount)
likesInfo: LikesCount;

    static createComment(postId: string, content: string, userId: string, userLogin: string): Comment {
        const comment = new Comment();

        comment.id = randomUUID();//
        comment.postId = postId;//
        comment.content = content;//
        comment.createdAt = new Date();//
        comment.commentatorInfo = new CommentatorInfo();
        comment.commentatorInfo.userId = userId;//
        comment.commentatorInfo.userLogin = userLogin;//
        comment.likesInfo = new LikesCount();
        comment.likesInfo.likesCount = 0;
        comment.likesInfo.dislikesCount = 0;

        return comment;
    }
}