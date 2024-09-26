import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

// const ApiSchema = new mongoose.Schema<ApiInfoType>({
//     ip: { type: String, require: true },
//     URL: { type: String, require: true }, 
//     date: { type: Date, require: true }, 
// })
// export const ApiModel = mongoose.model<ApiInfoType>('api-info', ApiSchema)


@Schema()
export class ApiInfo {
    @Prop({ required: true })
    ip: string;

    @Prop({ required: true })
    URL: string;

    @Prop({ required: true })
    date: Date;
}

export const ApiSchema = SchemaFactory.createForClass(ApiInfo);
ApiSchema.loadClass(ApiInfo);

export type ApiInfoDocument = HydratedDocument<ApiInfo>;

export type ApiInfoModelType = Model<ApiInfoDocument>