import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { BlogController } from "./blogs/api/blog.controller";
import { BlogService } from "./blogs/application/blog.service";
import { BlogRepository } from "./blogs/repository/blog.repository";
import { BlogQueryRepository } from "./blogs/repository/blog.query-repository";
// import { CommentController } from "./comments/api/comment.controller";
// import { CommentService } from "./comments/application/comment.service";
// import { CommentRepository } from "./comments/repository/comment.repository";
// import { CommentQueryRepository } from "./comments/repository/comment.query-repository";
import { PostController } from "./posts/api/post.controller";
import { PostService } from "./posts/application/post.service";
import { PostRepository } from "./posts/repository/post.repository";
import { PostQueryRepository } from "./posts/repository/post.query-repository";
import { CoreModule } from "src/infrastructure/core.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        CqrsModule,
        UsersModule,
        // CoreModule,
    ],
    controllers: [BlogController, /*CommentController,*/ PostController],
    providers: [BlogService, BlogRepository, BlogQueryRepository, /*CommentService, CommentRepository, CommentQueryRepository, */PostService, PostRepository, PostQueryRepository],
    exports: [BlogRepository, PostRepository, /*CommentRepository,*/ BlogRepository]
})
export class BloggersPlatformModule {
}