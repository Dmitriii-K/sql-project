// import { PostRepository } from "../../repository/post.repository";
// import { MeViewModel } from "src/features/auth/api/models/output.model";
// import { CommandHandler } from "@nestjs/cqrs";
// import { CommentInputModel } from "src/features/bloggers_platform/comments/api/models/input.model";
// import { NotFoundException } from "@nestjs/common";
// import { Comment } from "src/features/bloggers_platform/comments/domain/comment.entity";
// import { CommentRepository } from "src/features/bloggers_platform/comments/repository/comment.repository";

// export class CreateCommentByPostCommand {
//     constructor(
//         public paramId: string,
//         public body: CommentInputModel,
//         public user: MeViewModel
//         ) {}
// }

// @CommandHandler(CreateCommentByPostCommand)
// export class CreateCommentByPostUseCase {
//     constructor(
//         private postRepository: PostRepository,
//         private commentRepository: CommentRepository,
//     ) {}

//     async execute(command: CreateCommentByPostCommand) {
//         const {paramId, body, user} = command;
//         const post = await this.postRepository.findPostById(paramId);
//         if(!post) {
//             throw new NotFoundException()
//         }
//         const newComment: Comment = Comment.createComment(paramId, body.content, user.userId, user.login)
//         return this.commentRepository.insertComment(newComment);
//     }
// }