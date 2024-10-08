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

    // async getAllPosts(helper: TypePostHalper, user: MeViewModel | null): Promise<PaginatorPostViewModel> {
    //     const queryParams = postPagination(helper);
    //     const query = `
    //         SELECT * FROM "Posts"
    //         ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    //         LIMIT ${queryParams.pageSize} OFFSET ${(queryParams.pageNumber - 1) * queryParams.pageSize}
    //     `;
    //     const posts = await this.dataSource.query(query);
    //     const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Posts"`);

    //     const items = await Promise.all(posts.map(async post => {
    //         let userLikeStatus = likeStatus.None;
    //         if (user) {
    //             // Здесь можно добавить логику для получения статуса лайка пользователя
    //         }
    //         return this.mapPost(post, userLikeStatus);
    //     }));

    //     return {
    //         pagesCount: Math.ceil(totalCount[0].count / queryParams.pageSize),
    //         page: queryParams.pageNumber,
    //         pageSize: queryParams.pageSize,
    //         totalCount: parseInt(totalCount[0].count),
    //         items,
    //     };
    // }

    async getAllPosts(helper: TypePostHalper, user: MeViewModel | null): Promise<PaginatorPostViewModel> {
        const queryParams = postPagination(helper);
    
        const query = `
            SELECT p.*, b."name" AS "blogName",
            COUNT(CASE WHEN pl."likeStatus" = 'Like' THEN 1 END) AS "likesCount",
            COUNT(CASE WHEN pl."likeStatus" = 'Dislike' THEN 1 END) AS "dislikesCount"
            FROM "Posts" p
            LEFT JOIN "Blogs" b 
                ON p."blogId" = b.id
            LEFT JOIN "PostsLikes" pl 
                ON p.id = pl."postId"
            GROUP BY p.id, b."name"
            ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
            LIMIT $1 OFFSET $2
        `;
    
        const posts = await this.dataSource.query(query, [queryParams.pageSize, (queryParams.pageNumber - 1) * queryParams.pageSize]);
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
        const query = `
            SELECT p.*, b."name" AS "blogName",
                COUNT(CASE WHEN pl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
                COUNT(CASE WHEN pl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount
            FROM "Posts" p
            LEFT JOIN "Blogs" b 
                ON p."blogId" = b.id
            LEFT JOIN "PostsLikes" pl 
                ON p.id = pl."postId"
            WHERE p.id = $1
            GROUP BY p.id, b."name"
        `;
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

    // mapPost(post: Post, userLikeStatus?: likeStatus): PostViewModel {
    //     const newestLikes: NewestLikesType[] = [];
    //     return {
    //         id: post.id,
    //         title: post.title,
    //         shortDescription: post.shortDescription,
    //         content: post.content,
    //         blogId: post.blogId,
    //         blogName: post.blogName,
    //         createdAt: post.createdAt,
    //         extendedLikesInfo: {
    //             likesCount: post.extendedLikesInfo.likesCount,
    //             dislikesCount: post.extendedLikesInfo.dislikesCount,
    //             myStatus: userLikeStatus || likeStatus.None,
    //             newestLikes: newestLikes
    //         },
    //     };
    // }

    mapPost(post: any, userLikeStatus: likeStatus): PostViewModel {
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
                likesCount: parseInt(post.likesCount, 10) || 0,
                dislikesCount: parseInt(post.dislikesCount, 10) || 0,
                myStatus: userLikeStatus || likeStatus.None,
                newestLikes: newestLikes
            },
        };
    }
}