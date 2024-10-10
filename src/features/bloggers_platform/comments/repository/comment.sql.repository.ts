import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Comment } from "../domain/comment.sql.entity";
import { Like } from "../../likes/domain/CommentLike.sql.entity";

@Injectable()
export class CommentRepository {
    constructor(private dataSource: DataSource) {}

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const query = `
            UPDATE "Comments"
            SET content = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [content, commentId]);
        return result.rowCount === 1;
    }

    async findAllLikesForPost(postId: string): Promise<Like[]> {
        const query = `
            SELECT * FROM "Likes"
            WHERE "postId" = $1
        `;
        const result = await this.dataSource.query(query, [postId]);
        return result;
    }

    async findLike(commentId: string, userId: string): Promise<Like | null> {
        const query = `
            SELECT * FROM "Likes"
            WHERE "commentId" = $1 AND "userId" = $2
        `;
        const result = await this.dataSource.query(query, [commentId, userId]);
        return result.length ? result[0] : null;
    }

    async insertLike(data: Like): Promise<string> {
        const query = `
            INSERT INTO "Likes" (id, status, "userId", "addedAt")
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [data.id, data.status, data.userId, data.addedAt]);
        return result[0].id;
    }

    async updateLikeStatus(id: string, updateStatus: string): Promise<boolean> {
        const query = `
            UPDATE "Likes"
            SET "likeStatus" = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [updateStatus, id]);
        return result.rowCount === 1;
    }

    async updateLikesInfo(commentId: string, likesCount: number, dislikesCount: number): Promise<void> {
        const query = `
            UPDATE "Comments"
            SET "likesInfo.likesCount" = $1, "likesInfo.dislikesCount" = $2
            WHERE id = $3
        `;
        await this.dataSource.query(query, [likesCount, dislikesCount, commentId]);
    }

    async findComment(commentId: string): Promise<Comment | null> {
        const query = `
            SELECT * FROM "Comments"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [commentId]);
        return result.length ? result[0] : null;
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const query = `
            DELETE FROM "Comments"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [commentId]);
        return result.rowCount === 1;
    }

    async insertComment(data: Comment): Promise<string> {
        const query = `
            INSERT INTO "Comments" (id, content, "createdAt")
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            data.id,
            data.content,
            data.createdAt
        ]);
        return result[0].id;
    }
}