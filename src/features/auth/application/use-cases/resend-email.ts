import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { UserDocument } from "src/features/users/domain/user.entity";
import { randomUUID } from "crypto";
import { EmailService } from "src/infrastructure/adapters/sendEmail";
import { UserRepository } from "src/features/users/repository/user.repository";

export class ResendEmailCommand {
    constructor(public mail: string) {}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(commannd: ResendEmailCommand) {
        const {mail} = commannd;
        
        const user: UserDocument | null = await this.userRepository.findUserByEmail(mail);
        if (!user) {
            throw new BadRequestException({ errorsMessages: { message: "This email is incorrect", field: "email" } });
        }
        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "email" } });
        }
        const newCode = randomUUID();
        await this.userRepository.updateCode(user.id, newCode),
        this.emailService.sendMail(mail, newCode)
        return true;
    }
}