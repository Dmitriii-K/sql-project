import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CommentViewModel } from "../api/models/output.model";
import { CommentRepository } from "./comment.sql.repository";
import { likeStatus } from "src/features/bloggers_platform/likes/api/models/input.model";

@Injectable()
export class CommentQueryRepository {
    constructor(
        private dataSource: DataSource,
        protected commentRepository: CommentRepository
    ) {}

    async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
        const query = `
            SELECT c.*,
                COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
                COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount
            FROM "Comments" c
            LEFT JOIN "CommentsLikes" cl 
                ON c.id = cl."commentId"
            WHERE c.id = $1
            GROUP BY c.id
        `;
        const comment = await this.dataSource.query(query, [commentId]);

        if (!comment.length) {
            return null;
        }

        let userLikeStatus = likeStatus.None;
        if (userId) {
            const like = await this.commentRepository.findLike(commentId, userId);
            userLikeStatus = like ? like.status : likeStatus.None;
        }

        return this.mapComment(comment[0], userLikeStatus);
    }

    mapComment(comment: any, userLikeStatus?: likeStatus): CommentViewModel {
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: comment.userLogin
            },
            likesInfo: {
                likesCount: parseInt(comment.likesCount, 10) || 0,
                dislikesCount: parseInt(comment.dislikesCount, 10) || 0,
                myStatus: userLikeStatus || likeStatus.None
            }
        };
    }
}