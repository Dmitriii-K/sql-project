import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthRepository{
    constructor(
        // @InjectModel(ApiInfo.name) private apiModel: ApiInfoModelType
        ) {}

    // async resendMail (mail: string) {
    //     return UserModel.findOne({email: mail});
    // }
    // async dataRecording(ip: string, url: string, currentDate: Date) {
    //     const result = await ApiModel.create({ ip: ip, URL: url, date: currentDate });
    //     return result._id.toString();
    // }
    // async countingNumberRequests(ip: string, url: string, tenSecondsAgo: Date) {
    //     const filterDocument = {
    //         ip: ip,
    //         URL: url,
    //         date: { $gte: tenSecondsAgo }
    //     };
    //     return ApiModel.countDocuments(filterDocument);
    // }
}