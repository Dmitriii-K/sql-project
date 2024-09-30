import { CommandHandler } from "@nestjs/cqrs";
import { NewPasswordRecoveryInputModel } from "../../api/models/input.model";
import { BcryptService } from "src/infrastructure/adapters/bcrypt";
import { UserRepository } from "src/features/users/repository/users-sql-repository";
import { User } from "src/features/users/domain/user.sql.entity";

export class NewPasswordCommand {
    constructor(public body: NewPasswordRecoveryInputModel) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private bcryptService: BcryptService
    ) {}

    async execute(command: NewPasswordRecoveryInputModel): Promise<boolean> {
        // Проверяем, существует ли пользователь с таким кодом восстановления
        const user: User | null = await this.userRepository.findUserByCode(command.recoveryCode);
        if (!user) return false; // Пользователь не найден или код недействителен
        if (user.confirmationCode !== command.recoveryCode) return false;
        // Хешируем новый пароль
        const password = await this.bcryptService.createHashPassword(command.newPassword);
        // Обновляем пароль пользователя
        const result = await this.userRepository.updatePassword(user.id.toString(), password);
        if (result) {
            return true;
        } else {
            return false;
        }
    }
}