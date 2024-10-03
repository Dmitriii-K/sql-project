import { Injectable } from "@nestjs/common";
import { TypePostHalper } from "src/base/types/post.types";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { DataSource } from "typeorm";
import { PaginatorPostViewModel, PostViewModel } from "../api/models/output.model";
import { postPagination } from "src/base/models/post.model";
import { likeStatus, NewestLikesType } from "../../likes/api/models/input.model";
import { Post } from "../domain/post.sql.entity";

@Injectable()
export class PostQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getAllPosts(helper: TypePostHalper, user: MeViewModel | null): Promise<PaginatorPostViewModel> {
        const queryParams = postPagination(helper);
        const query = `
            SELECT * FROM "Posts"
            ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
            LIMIT ${queryParams.pageSize} OFFSET ${(queryParams.pageNumber - 1) * queryParams.pageSize}
        `;
        const posts = await this.dataSource.query(query);
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Posts"`);

        const items = await Promise.all(posts.map(async post => {
            let userLikeStatus = likeStatus.None;
            if (user) {
                // Здесь можно добавить логику для получения статуса лайка пользователя
            }
            return this.mapPost(post, userLikeStatus);
        }));

        return {
            pagesCount: Math.ceil(totalCount[0].count / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: parseInt(totalCount[0].count),
            items,
        };
    }

    async findPostById(postId: string, userId: string | null): Promise<PostViewModel | null> {
        const query = `SELECT * FROM "Posts" WHERE id = $1`;
        const post = await this.dataSource.query(query, [postId]);

        if (!post.length) {
            return null;
        }

        let userLikeStatus = likeStatus.None;
        if (userId) {
            // Здесь можно добавить логику для получения статуса лайка пользователя
        }

        return this.mapPost(post[0], userLikeStatus);
    }

    mapPost(post: Post, userLikeStatus?: likeStatus): PostViewModel {
        const newestLikes: NewestLikesType[] = [];
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: userLikeStatus || likeStatus.None,
                newestLikes: newestLikes
            },
        };
    }
}