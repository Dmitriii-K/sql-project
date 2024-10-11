import { Injectable } from "@nestjs/common";
import { TypePostHalper } from "src/base/types/post.types";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { DataSource } from "typeorm";
import { PaginatorPostViewModel, PostViewModel } from "../api/models/output.model";
import { postPagination } from "src/base/models/post.model";
import { likeStatus, NewestLikesType } from "../../likes/api/models/input.model";
import { Post } from "../domain/post.sql.entity";
import { CommentViewModel, PaginatorCommentViewModelDB } from "../../comments/api/models/output.model";
import { commentsPagination } from "src/base/models/comment.model";
import { Comment } from "../../comments/domain/comment.sql.entity";

@Injectable()
export class PostQueryRepository {
    constructor(private dataSource: DataSource) {}

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

    // async findCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    //     const query = `
    //         SELECT c.*, u.id AS "userId", u.login AS "userLogin",
    //             COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
    //             COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount,
    //             --COALESCE(твой запрос или колонка, 'None')
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
    async findCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
        const query = `
            SELECT c.*, u.id AS "userId", u.login AS "userLogin",
                COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
                COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount,
                COALESCE((SELECT cl2."likeStatus" FROM "CommentsLikes" cl2 WHERE cl2."commentsId" = c.id AND cl2."userId" = $2), 'None') AS userLikeStatus
            FROM "Comments" c
            LEFT JOIN "CommentsLikes" cl ON c.id = cl."commentsId"
            LEFT JOIN "Users" u ON c."userId" = u.id
            WHERE c.id = $1
            GROUP BY c.id, u.id, u.login
        `;
        const comment = await this.dataSource.query(query, [commentId, userId]);
    
        if (!comment.length) {
            return null;
        }
    
        return this.mapComment(comment[0]);
    }

    // async findCommentByPost(helper: TypePostHalper, postId: string, userId: string | null): Promise<PaginatorCommentViewModelDB> {
    //     const queryParams = commentsPagination(helper);
    
    //     const query = `
    //         SELECT c.*,
    //             CAST(COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END), integer) AS likesCount,
    //             COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount
    //         FROM "Comments" c
    //         LEFT JOIN "CommentsLikes" cl 
    //             ON c.id = cl."commentId"
    //         WHERE c."postId" = $1
    //         GROUP BY c.id
    //         ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    //         LIMIT $2 OFFSET $3
    //     `;
    
    //     const comments = await this.dataSource.query(query, [postId, queryParams.pageSize, (queryParams.pageNumber - 1) * queryParams.pageSize]);
    //     const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Comments" WHERE "postId" = $1`, [postId]);
    
    //     const items = await Promise.all(comments.map(async comment => {
    //         return this.mapComment(comment);
    //     }));
    
    //     return {
    //         pagesCount: Math.ceil(totalCount[0].count / queryParams.pageSize),
    //         page: queryParams.pageNumber,
    //         pageSize: queryParams.pageSize,
    //         totalCount: parseInt(totalCount[0].count),
    //         items,
    //     };
    // }
    async findCommentByPost(helper: TypePostHalper, postId: string, userId: string | null): Promise<PaginatorCommentViewModelDB> {
        const queryParams = commentsPagination(helper);
    
        const query = `
            SELECT c.*, u.id AS "userId", u.login AS "userLogin",
                COUNT(CASE WHEN cl."likeStatus" = 'Like' THEN 1 END) AS likesCount,
                COUNT(CASE WHEN cl."likeStatus" = 'Dislike' THEN 1 END) AS dislikesCount,
                COALESCE((SELECT cl2."likeStatus" FROM "CommentsLikes" cl2 WHERE cl2."commentsId" = c.id AND cl2."userId" = $3), 'None') AS userLikeStatus
            FROM "Comments" c
            LEFT JOIN "CommentsLikes" cl ON c.id = cl."commentsId"
            LEFT JOIN "Users" u ON c."userId" = u.id
            WHERE c."postId" = $1
            GROUP BY c.id, u.id, u.login
            ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
            LIMIT $2 OFFSET $4
        `;
    
        const comments = await this.dataSource.query(query, [postId, queryParams.pageSize, userId, (queryParams.pageNumber - 1) * queryParams.pageSize]);
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Comments" WHERE "postId" = $1`, [postId]);
    
        const items = await Promise.all(comments.map(async comment => {
            return this.mapComment(comment);
        }));
    
        return {
            pagesCount: Math.ceil(totalCount[0].count / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: parseInt(totalCount[0].count),
            items,
        };
    }

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
            myStatus: comment.userLikeStatus || likeStatus.None
            }
        };
    }
}