import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Blog } from '../domain/blog.sql.entity';
import { Post } from '../../posts/domain/post.sql.entity';
import { likeStatus, NewestLikesType } from '../../likes/api/models/input.model';
import { TypeBlogHalper, TypePostForBlogHalper } from 'src/base/types/blog.types';
import { BlogViewModel, PaginatorBlogViewModel } from '../api/models/output.model';
import { PaginatorPostViewModel, PostViewModel } from '../../posts/api/models/output.model';
import { blogPagination } from 'src/base/models/blog.model';

@Injectable()
export class BlogQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getAllBlogs(helper: TypeBlogHalper): Promise<PaginatorBlogViewModel> {
        const queryParams = blogPagination(helper);
        const search = helper.searchNameTerm
            ? `WHERE "name" ILIKE '%${helper.searchNameTerm}%'`
            : '';

        const query = `
            SELECT * FROM "Blogs"
            ${search}
            ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
            LIMIT ${queryParams.pageSize} OFFSET ${(queryParams.pageNumber - 1) * queryParams.pageSize}
        `;

        const items = await this.dataSource.query(query);
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Blogs" ${search}`);

        const blogs = {
            pagesCount: Math.ceil(totalCount[0].count / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount: parseInt(totalCount[0].count),
            items: items.map(this.blogMap),
        };

        return blogs;
    }

    async getBlogById(blogId: string): Promise<BlogViewModel | null> {
        const query = `SELECT * FROM "Blogs" WHERE id = $1`;
        const blog = await this.dataSource.query(query, [blogId]);

        if (!blog.length) {
            return null;
        }

        return this.blogMap(blog[0]);
    }

    // async getPostForBlogById(postId: string): Promise<PostViewModel | null> {// blogId???
    //     // const query = `SELECT * FROM "Posts" WHERE id = $1`;
    //     const query = `
    //         SELECT p.*, b."name" 
    //         FROM "Posts" p
    //         left join "Blogs" b
    //         on p."blogId" = b.id 
    //         WHERE p."blogId" = $1
    //     `;

    //     const post = await this.dataSource.query(query, [postId]);// blogId???

    //     if (!post.length) {
    //         return null;
    //     }

    //     // let extendedLikesInfo = ;
    //     let userLikeStatus = likeStatus.None;
    //     return this.mapPost(post[0], userLikeStatus);
    // }

    async getPostForBlogById(postId: string): Promise<PostViewModel | null> {
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
        return this.mapPost(post[0], userLikeStatus);
    }

    // async getPostsForBlog(helper: TypePostForBlogHalper, id: string, userId: string | null): Promise<PaginatorPostViewModel> {
    //     const queryParams = blogPagination(helper);

    //     const query = `
    //         SELECT * 
    //         FROM "Posts"
    //         WHERE "blogId" = $1
    //         ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    //         LIMIT ${queryParams.pageSize} OFFSET ${(queryParams.pageNumber - 1) * queryParams.pageSize}
    //     `;

    //     const posts = await this.dataSource.query(query, [id]);
    //     const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Posts" WHERE "blogId" = $1`, [id]);

    //     const items = await Promise.all(posts.map(async post => {
    //         let like;
    //         if (userId) {
    //             // Здесь можно добавить логику для получения статуса лайка пользователя
    //         }
    //         const userLikeStatus = like ? like.status : likeStatus.None;
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

    async getPostsForBlog(helper: TypePostForBlogHalper, id: string, userId: string | null): Promise<PaginatorPostViewModel> {
        const queryParams = blogPagination(helper);
    
        // Исправленный SQL-запрос
        const query = `
            SELECT p.*, b."name" AS "blogName",
            COUNT(CASE WHEN pl."likeStatus" = 'Like' THEN 1 END) AS "likesCount",
            COUNT(CASE WHEN pl."likeStatus" = 'Dislike' THEN 1 END) AS "dislikesCount"
            FROM "Posts" p
            LEFT JOIN "Blogs" b 
                ON p."blogId" = b.id
            LEFT JOIN "PostsLikes" pl 
                ON p.id = pl."postId"
            WHERE p."blogId" = $1
            GROUP BY p.id, b."name"
            ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
            LIMIT $2 OFFSET $3
        `;
    
        const posts = await this.dataSource.query(query, [id, queryParams.pageSize, (queryParams.pageNumber - 1) * queryParams.pageSize]);
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Posts" WHERE "blogId" = $1`, [id]);
    
        const items = await Promise.all(posts.map(async post => {
            let userLikeStatus = likeStatus.None;
            if (userId) {
                // Здесь можно добавить логику для получения статуса лайка пользователя
                const like = await this.dataSource.query(`SELECT "likeStatus" FROM "PostsLikes" WHERE "postId" = $1 AND "userId" = $2`, [post.id, userId]);
                userLikeStatus = like.length > 0 ? like[0].likeStatus : likeStatus.None;
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

    blogMap(blog: Blog): BlogViewModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
}