import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BlogService } from "../application/blog.service";
import { BlogQueryRepository } from "../repository/blog.sql.query-repository";
import { TypeBlogHalper, TypePostForBlogHalper } from "src/base/types/blog.types";
import { PaginatorBlogViewModel } from "./models/output.model";
import { BlogInputModel, BlogPostInputModel } from "./models/input.model";
import { BlogRepository } from "../repository/blog.sql.repository";
import { BlogExistsPipe } from "src/infrastructure/pipes/blogExists.pipe";
import { Request, Response } from "express";
import { BasicAuthGuard } from "src/infrastructure/guards/basic.guard";
import { SoftAuthGuard } from "src/infrastructure/guards/dubl-guards/soft-auth.guard";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePostForBlogCommand } from "../application/use-cases/create-post-for-blog";


@Controller('blogs')
export class BlogController {
    constructor(
        protected blogService: BlogService,
        protected blogQueryRepository: BlogQueryRepository,
        protected blogRepository: BlogRepository,
        private commandBus: CommandBus
    ) {}

    @Get()//---- sa???
    async getAllBlogs(@Query() query: TypeBlogHalper) {
        const blogs: PaginatorBlogViewModel = await this.blogQueryRepository.getAllBlogs(query);
        return blogs;
    }

    @UseGuards(BasicAuthGuard)
    @Post()//----
    async createBlog(@Body() body: BlogInputModel) {
        const createResult = await this.blogService.createBlog(body);
        if (!createResult) {
            throw new NotFoundException();
        }
        const newBlog = await this.blogQueryRepository.getBlogById(createResult);
        return newBlog;
    }

    @UseGuards(SoftAuthGuard)
    @Get(':id/posts')//----
    async getPostForBlog(
        @Query() query: TypePostForBlogHalper,
        @Param('id', BlogExistsPipe) id: string,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            const userId: string | null = req.user ? req.user.userId : null;
            const posts = await this.blogQueryRepository.getPostForBlog(query, id, userId);
            if(!posts) {
                throw new NotFoundException();
            }
            return posts;
    }

    @UseGuards(BasicAuthGuard)
    @Post(':id/posts')//----
    async createPostForBlog(
        @Param('id') id: string,
        @Body() body: BlogPostInputModel) {
            const findBlog = await this.blogService.findBlogById(id);
            if (!findBlog) {
                throw new NotFoundException();
            }
            // const createResult = await this.blogService.createPostForBlog(id, body, findBlog.name);
            const createResult = await this.commandBus.execute(new CreatePostForBlogCommand(id, body, findBlog.name));
            const newPostForBlog = await this.blogQueryRepository.getPostForBlogById(createResult);
            return newPostForBlog;
    }

    @Get(':id')//----
    async getBlogById(@Param('id') id: string) {
        const blogResult = await this.blogQueryRepository.getBlogById(id);
        if (!blogResult) {
            throw new NotFoundException();
        }
        return blogResult;
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')//----
    @HttpCode(204)
    async updateBlog(
        @Param('id') id: string,
        @Body() body: BlogInputModel) {
            const findBlog = await this.blogService.findBlogById(id);
            if (!findBlog) {
                throw new NotFoundException();
            }
            const updateBlogResult = await this.blogService.updateBlog(id, body);
            return updateBlogResult;
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')//----
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {
        const deleteResult = await this.blogService.deleteBlog(id);
        if (!deleteResult) {
        throw new NotFoundException();
        }
    }

    // @UseGuards(BasicAuthGuard)
    // @Put(':blogId/posts/:postId')//----
    // @HttpCode(204)
    // async updatePostByIdForBlogId(
    //     @Param('id') id: string, // blogId, postId
    //     @Body() body: BlogPostInputModel) {
    //         const findBlog = await this.blogService.findBlogById(id);
    //         if (!findBlog) {
    //             throw new NotFoundException();
    //         }
    //         const updateBlogResult = await this.blogService.updatePostByIdForBlogId(blogId, postId, body);
    //         return updateBlogResult;
    // }

    // @UseGuards(BasicAuthGuard)
    // @Delete(':blogId/posts/:postId')//----
    // @HttpCode(204)
    // async deletePostByIdForBlogId(
    //     @Param('id') id: string) { // blogId, postId
    //     const deleteResult = await this.blogService.deletePostByIdForBlogId(blogId, postId);
    //     if (!deleteResult) {
    //     throw new NotFoundException();
    //     }
    // }
}