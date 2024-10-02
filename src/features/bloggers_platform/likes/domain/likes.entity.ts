import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose'
import { likeStatus } from '../api/models/input.model';


// const LikesSchema = new mongoose.Schema<LikesType>({
//     addedAt: {type: String, require: true},
//     commentId: {type: String, require: true},
//     userId: {type: String, require: true},
//     userIogin: {type: String, require: true},
//     status: { type: String, enum: Object.values(likeStatus), require: true, default: likeStatus.None }
// })
// export const LikesModel = mongoose.model<LikesType>('likes', LikesSchema)

// export const likeStatusValidation = [
//     body("likeStatus")
//     .isString()
//     .trim()
//     .isIn(enumValues)
//     .withMessage("Invalid value")
// ];

@Schema()
export class Like {
    @Prop({ required: true })
    addedAt: string;

    @Prop({ required: true })
    commentId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    userLogin: string;

    @Prop({ type: String, enum: Object.values(likeStatus), required: true, default: likeStatus.None })
    status: likeStatus;

    static createLike(commentId: string, userId: string, login: string, data: likeStatus): Like {
        const like = new this();

        // console.table({commentId: commentId, userId: userId,status: data})
        
        like.addedAt = new Date().toISOString();
        like.commentId = commentId;
        like.userId = userId;
        like.userLogin = login;
        like.status = data || likeStatus.None

        return like;
    }
}

export const LikesSchema = SchemaFactory.createForClass(Like);
LikesSchema.loadClass(Like);

export type LiketDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LiketDocument>