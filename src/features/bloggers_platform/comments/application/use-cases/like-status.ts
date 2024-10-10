import { likeStatus } from "src/features/bloggers_platform/likes/api/models/input.model";
import { Like } from "src/features/bloggers_platform/likes/domain/CommentLike.sql.entity";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { CommentRepository } from "../../repository/comment.sql.repository";
import { CommentViewModel } from "../../api/models/output.model";
import { CommandHandler } from "@nestjs/cqrs";

export class LikeStatusCommand {
    constructor(
        public user: MeViewModel,
        public body: likeStatus,
        public comment: CommentViewModel,
    ) {}
}

@CommandHandler(LikeStatusCommand)
export class LikeStatusUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async execute(command: LikeStatusCommand) {
        const {user, body, comment} = command;

        const existLike = await this.commentRepository.findLike(comment.id, user.userId);
        if (!existLike) {
            const newLike: Like = Like.createLike(user.userId, body);
            if (body === likeStatus.Like) {
                comment.likesInfo.likesCount++;
            } else if (body === likeStatus.Dislike) {
                comment.likesInfo.dislikesCount++;
            }
            await this.commentRepository.insertLike(newLike);
            await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
            return true;
        } else {
            if (existLike.status !== body) {
                // Обновление счетчиков лайков и дизлайков
                if (existLike.status === likeStatus.Like && body === likeStatus.Dislike) {
                    comment.likesInfo.likesCount--;
                    comment.likesInfo.dislikesCount++;
                } else if (existLike.status === likeStatus.Dislike && body === likeStatus.Like) {
                    comment.likesInfo.dislikesCount--;
                    comment.likesInfo.likesCount++;
                } else if (existLike.status === likeStatus.Like && body === likeStatus.None) {
                    comment.likesInfo.likesCount--;
                } else if (existLike.status === likeStatus.Dislike && body === likeStatus.None) {
                    comment.likesInfo.dislikesCount--;
                } else if (existLike.status === likeStatus.None && body === likeStatus.Like) {
                    comment.likesInfo.likesCount++;
                } else if (existLike.status === likeStatus.None && body === likeStatus.Dislike) {
                    comment.likesInfo.dislikesCount++;
                }
                existLike.status = body;
                await this.commentRepository.updateLikeStatus(comment.id, existLike.status);
                await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
                return true;
            }
        }
        return false;
    }
}