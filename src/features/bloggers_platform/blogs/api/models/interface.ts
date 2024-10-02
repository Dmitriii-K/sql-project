import { PaginatorPostViewModel, PostViewModel } from "src/features/bloggers_platform/posts/api/models/output.model";
import { BlogInputModel, BlogPostInputModel } from "./input.model";
import { BlogViewModel, PaginatorBlogViewModel } from "./output.model";
import { TypeBlogHalper, TypePostForBlogHalper } from "src/base/types/blog.types";
import { BlogDocument } from "../../domain/blog.entity";
import { PostDocument } from "src/features/bloggers_platform/posts/domain/post.entity";
import { likeStatus, LikesType } from "src/features/bloggers_platform/likes/api/models/input.model";


export interface IBlogService {
    createBlog(blog: BlogInputModel): Promise<string | null>;
    findBlogById(blogId: string): Promise<BlogDocument | null>;
    createPostForBlog(blogId: string, post: BlogPostInputModel, blogName: string): Promise<string>;// null нужно указывать?
    updateBlog(blogId: string, updateContent: BlogInputModel): Promise<boolean>;
    deleteBlog(blogId: string): Promise<boolean>;
}

export interface IBlogQueryRepository {
    getBlogById(blogId: string): Promise<BlogViewModel | null>;
    getPostForBlogById(postId: string): Promise<PostViewModel | null>;
    getAllBlogs(query: TypeBlogHalper): Promise<PaginatorBlogViewModel>;
    getPostFofBlog(query: TypePostForBlogHalper, blogId: string, userId: string | null): Promise<PaginatorPostViewModel>;
    mapPost(post: BlogDocument, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel;
    blogMap(blog: BlogDocument): BlogViewModel;
}

export interface IBlogRepository {
    insertBlog(blog: BlogDocument): Promise<string>;
    insertPostForBlog(post: PostDocument): Promise<string>;
    findBlogById(id: string): Promise<BlogDocument | null>;
    updateBlog(id: string, updateContent: BlogInputModel): Promise<boolean>;
    deleteBlog(id: string): Promise<boolean>;
}

export interface ICommentRepository {
    findLike(commentId: string, userId: string): Promise<LikesType | null>;
    findAllLikesForPost(postId: string): Promise<LikesType[]>;
}