import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PostInputModel } from "../api/models/input.model";
import { Post } from "../domain/post.sql.entity";

@Injectable()
export class PostRepository {
    constructor(private dataSource: DataSource) {}

    async findPostById(postId: string): Promise<Post | null> {
        const query = `SELECT * FROM "Posts" WHERE id = $1`;
        const result = await this.dataSource.query(query, [postId]);
        return result.length ? result[0] : null;
    }

    async insertPost(post: Post): Promise<string> {
        const query = `
            INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.createdAt
        ]);
        return result[0].id;
    }

    async updatePost(post: PostInputModel, postId: string): Promise<boolean> {
        const query = `
            UPDATE "Posts"
            SET title = $1, "shortDescription" = $2, content = $3, "blogId" = $4
            WHERE id = $5
        `;
        const result = await this.dataSource.query(query, [
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            postId
        ]);
        return !!result[1];
    }

    async updatePostCount(postId: string, likesCount: number, dislikesCount: number): Promise<boolean> {
        const query = `
            UPDATE "Posts"
            SET "extendedLikesInfo.likesCount" = $1, "extendedLikesInfo.dislikesCount" = $2
            WHERE id = $3
        `;
        const result = await this.dataSource.query(query, [likesCount, dislikesCount, postId]);
        return !!result[1];
    }

    async deletePost(postId: string): Promise<boolean> {
        const query = `DELETE FROM "Posts" WHERE id = $1`;
        const result = await this.dataSource.query(query, [postId]);
        return !!result[1];
    }

    async insertPostForBlog(post: Post): Promise<string> {
        const query = `
            INSERT INTO "Posts" (id, title, "shortDescription", content, "blogId", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.createdAt
        ]);
        return result[0].id;
    }
}