// import { Injectable } from "@nestjs/common";
// import { CommentRepository } from "../repository/comment.repository";

// @Injectable()
// export class CommentService /*implements ICommentService*/{
//     constructor(private commentRepository: CommentRepository) {}

//     async findUserByComment(id: string) {
//         const user = await this.commentRepository.findUserByComment(id);
//         if (!user) {
//             return null;
//         } else {
//             return user;
//         }
//     }
//     async updateComment(id: string, content: string) {
//         const updateResult = await this.commentRepository.updateComment(id, content);
//         if (updateResult) {
//             return updateResult;
//         } else {
//             return false;
//         }
//     }
//     // async likeStatus(user: MeViewModel, data: likeStatus, comment: CommentViewModel) {
//     //     const existLike = await this.commentRepository.findLike(comment.id, user.userId);
//     //     if (!existLike) {
//     //         const newLike: Like = Like.createLike(comment.id, user.userId, user.login, data);
//     //         if (data === likeStatus.Like) {
//     //             comment.likesInfo.likesCount++;
//     //         } else if (data === likeStatus.Dislike) {
//     //             comment.likesInfo.dislikesCount++;
//     //         }
//     //         await this.commentRepository.insertLike(newLike);
//     //         await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
//     //         return true;
//     //     } else {
//     //         if (existLike.status !== data) {
//     //             // Обновление счетчиков лайков и дизлайков
//     //             if (existLike.status === likeStatus.Like && data === likeStatus.Dislike) {
//     //                 comment.likesInfo.likesCount--;
//     //                 comment.likesInfo.dislikesCount++;
//     //             } else if (existLike.status === likeStatus.Dislike && data === likeStatus.Like) {
//     //                 comment.likesInfo.dislikesCount--;
//     //                 comment.likesInfo.likesCount++;
//     //             } else if (existLike.status === likeStatus.Like && data === likeStatus.None) {
//     //                 comment.likesInfo.likesCount--;
//     //             } else if (existLike.status === likeStatus.Dislike && data === likeStatus.None) {
//     //                 comment.likesInfo.dislikesCount--;
//     //             } else if (existLike.status === likeStatus.None && data === likeStatus.Like) {
//     //                 comment.likesInfo.likesCount++;
//     //             } else if (existLike.status === likeStatus.None && data === likeStatus.Dislike) {
//     //                 comment.likesInfo.dislikesCount++;
//     //             }
//     //             existLike.status = data;
//     //             await this.commentRepository.updateLikeStatus(comment.id, existLike.status);
//     //             await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
//     //             return true;
//     //         }
//     //     }
//     //     return false;
//     // }
//     async deleteComment(id: string) {
//         const deleteResult = await this.commentRepository.deleteComment(id);
//         if (deleteResult) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }