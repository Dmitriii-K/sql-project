import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { UserDocument } from "src/features/users/domain/user.entity";
import { randomUUID } from "crypto";
import { EmailService } from "src/infrastructure/adapters/sendEmail";
import { UserRepository } from "src/features/users/repository/user.repository";

export class PasswordRecoveryCommand {
    constructor(public mail: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(command: PasswordRecoveryCommand): Promise<boolean> {
        const {mail} = command;
        // Проверяем, существует ли пользователь с таким email
        const user: UserDocument | null = await this.userRepository.findUserByEmail(mail);
        if (!user) {
            throw new BadRequestException();
        } // Пользователь не найден
        // Генерируем код восстановления
        const recoveryCode = randomUUID();
        await this.userRepository.updateCode(user.id, recoveryCode);
        await this.emailService.sendPasswordRecoveryMail(mail, recoveryCode);
        return true;
    }
}