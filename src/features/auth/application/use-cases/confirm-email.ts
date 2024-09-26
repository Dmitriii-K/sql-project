import { CommandHandler } from "@nestjs/cqrs";
import { UserDocument } from "src/features/users/domain/user.entity";
import { UserRepository } from "src/features/users/repository/user.repository";
import { BadRequestException } from "@nestjs/common";

export class ConfirmEmailCommand {
    constructor(public code: string ) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(command: ConfirmEmailCommand) {
        const {code} = command;
        const user: UserDocument | null = await this.userRepository.findUserByCode(code);
        if (!user) {
            throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
        }
        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "code" } });
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
        }
        if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
            throw new BadRequestException({ errorsMessages: { message: "Expiration date is over", field: "code" } });
        }
        const result = await this.userRepository.updateConfirmation(user.id);
        return result;
    }
}