import { Global, Module } from "@nestjs/common";
import { EmailService } from "./sendEmail";
import { JwtService } from "./jwt.service";
import { BcryptService } from "./bcrypt";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [BcryptService, JwtService, EmailService],
    exports: [BcryptService, JwtService, EmailService]
})
export class AdaptersModule {
}