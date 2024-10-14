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

    // async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
    //     const query = `
    //         SELECT c.*,
    //             COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
    //             COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount
    //         FROM "Comments" c
    //         LEFT JOIN "CommentsLikes" cl 
    //             ON c.id = cl."commentsId"
    //         WHERE c.id = $1
    //         GROUP BY c.id
    //     `;
    //     const comment = await this.dataSource.query(query, [commentId]);

    //     if (!comment.length) {
    //         return null;
    //     }

    //     return this.mapComment(comment[0]);
    // }

    // async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
    //     const query = `
    //         SELECT c.*, u.id AS "userId", u.login AS "userLogin",
    //             COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
    //             COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount,
    //             COALESCE((SELECT cl2."likeStatus" FROM "CommentsLikes" cl2 WHERE cl2."commentsId" = c.id AND cl2."userId" = $2), 'None') AS userLikeStatus
    //         FROM "Comments" c
    //         LEFT JOIN "CommentsLikes" cl ON c.id = cl."commentsId"
    //         LEFT JOIN "Users" u ON c."userId" = u.id
    //         WHERE c.id = $1
    //         GROUP BY c.id, u.id, u.login
    //     `;
    //     const comment = await this.dataSource.query(query, [commentId, userId]);
    
    //     if (!comment.length) {
    //         return null;
    //     }
    
    //     return this.mapComment(comment[0]);
    // }
    async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
        const query = `
            SELECT 
            c.id, 
            c.content, 
            c."createdAt", 
            u.id AS "userId", 
            u.login AS "userLogin",
            COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS "likesCount",
            COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS "dislikesCount",
            COALESCE(cl2."likeStatus", 'None') AS "userLikeStatus"
        FROM "Comments" c
        LEFT JOIN "CommentsLikes" cl 
            ON c.id = cl."commentsId"
        LEFT JOIN "Users" u 
            ON c."userId" = u.id
        LEFT JOIN "CommentsLikes" cl2 
            ON c.id = cl2."commentsId" AND cl2."userId" = $2
        WHERE c.id = $1
        GROUP BY c.id, c.content, c."createdAt", u.id, u.login, cl2."likeStatus";
    `;
        const comment = await this.dataSource.query(query, [commentId, userId]);
        // console.log('comment1', comment);//-------------------

        if (!comment.length) {
            return null;
        }
        // console.log('comment2', comment);//-------------------
    
        return this.mapComment(comment[0]);
    }
    

    mapComment(comment: any): CommentViewModel {
        // json_build_object() as comentatorInfo
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
            myStatus: comment.userLikeStatus 
            }
        };
    }
}