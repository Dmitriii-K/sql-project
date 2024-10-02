import { Injectable } from "@nestjs/common";
import { PostRepository } from "../repository/post.repository";
import { PostInputModel } from "../api/models/input.model";
import { Post } from "../domain/post.entity";
import {WithId} from "mongodb"

@Injectable()
export class PostService {
    constructor(private postRepository: PostRepository) {}

    async updatePost(data: PostInputModel, id: string) {
        const succsesUpdate = await this.postRepository.updatePost(data, id);
        if (succsesUpdate) {
            return succsesUpdate;
        } else {
            return false;
        }
    }
    async getPostById(postId: string) {
        return this.postRepository.findPostById(postId);
    }
    async findPostById(postId: string): Promise<WithId<Post> | null>  {
        return this.postRepository.findPostById(postId);
    }
}