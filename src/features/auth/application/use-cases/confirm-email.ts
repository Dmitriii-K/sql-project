import { CommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "src/features/users/repository/users-sql-repository";
import { BadRequestException } from "@nestjs/common";
import { User } from "src/features/users/domain/user.sql.entity";

export class ConfirmEmailCommand {
    constructor(public code: string ) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(command: ConfirmEmailCommand) {
        const {code} = command;
        const user: User | null = await this.userRepository.findUserByCode(code);
        if (!user) {
            throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
        }
        if (user.isConfirmed) {
            throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "code" } });
        }
        if (user.confirmationCode !== code) {
            throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
        }
        if (user.expirationDate < new Date().toISOString()) {
            throw new BadRequestException({ errorsMessages: { message: "Expiration date is over", field: "code" } });
        }
        const result = await this.userRepository.updateConfirmation(user.id.toString());
        return result;
    }
}