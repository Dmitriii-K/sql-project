import { PostRepository } from "../../repository/post.sql.repository";
import { Post } from "../../domain/post.sql.entity";
import { MeViewModel } from "src/features/auth/api/models/output.model";
import { likeStatus } from "src/features/bloggers_platform/likes/api/models/input.model";
import { CommandHandler } from "@nestjs/cqrs";
import { PostLike } from "src/features/bloggers_platform/likes/domain/PostLikes.sql.entity";

export class UpdatePostLikeCommand {
    constructor(
        public userId: string,
        public body: likeStatus,
        public post: Post
        ) {}
}

@CommandHandler(UpdatePostLikeCommand)
export class UpdatePostLikeUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(command: UpdatePostLikeCommand) {
        const {userId, body, post} = command;

        const existPostLike = await this.postRepository.findPostLike(post.id);
        // console.log('postLike', existPostLike);//-------------------
        // console.log('likeStatus', body);//-------------------
        if (!existPostLike) {
            // console.log('userId', userId);//-------------------
            const newPostLike: PostLike = PostLike.createPostLike(userId, post.id, body);
            // console.log('postLike', newPostLike);//-------------------
            await this.postRepository.insertPostLike(newPostLike);
        } else {
            if (existPostLike.likeStatus !== body) {
                await this.postRepository.updatePostLikeStatus(post.id, userId, body);
            }
        }
        return true;
    }
}