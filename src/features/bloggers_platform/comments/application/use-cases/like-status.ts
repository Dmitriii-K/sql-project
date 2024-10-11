import { likeStatus } from "src/features/bloggers_platform/likes/api/models/input.model";
import { CommentsLike } from "src/features/bloggers_platform/likes/domain/CommentLike.sql.entity";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { CommentRepository } from "../../repository/comment.sql.repository";
import { CommentViewModel } from "../../api/models/output.model";
import { CommandHandler } from "@nestjs/cqrs";

export class LikeStatusCommand {
    constructor(
        public userId: string,
        public body: likeStatus,
        public comment: CommentViewModel,
    ) {}
}

@CommandHandler(LikeStatusCommand)
export class LikeStatusUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async execute(command: LikeStatusCommand) {
        const {userId, body, comment} = command;

        const existCommentLike = await this.commentRepository.findCommentLike(comment.id);
        if (!existCommentLike) {
            const newCommentLike: CommentsLike = CommentsLike.createCommentLike(userId, comment.id, body);
            await this.commentRepository.insertCommentLike(newCommentLike);
            return true;
        } else {
            if (existCommentLike.likeStatus !== body) {
                await this.commentRepository.updateCommentLikeStatus(comment.id, userId, existCommentLike.likeStatus);
                return true;
            }
        }
        return false;
    }
}