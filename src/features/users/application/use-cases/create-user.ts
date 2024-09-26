import { UserInputModel } from "../../api/models/input.models";
import { User } from "../../domain/user.entity";
import { BcryptService } from "src/infrastructure/adapters/bcrypt";
import { UserRepository } from "../../repository/user.repository";
import { CommandHandler} from "@nestjs/cqrs";

export class CreateUserCommand {
    constructor(public body: UserInputModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase /*implements ICommandHandler<CreateUserCommand>*/{
    constructor(
        private userRepository: UserRepository,
        private bcryptService: BcryptService) {}

    async execute(command: CreateUserCommand) {
        const userExist = await this.userRepository.findUserByLogiOrEmail({ login: command.body.login, email: command.body.email });
        if (userExist) {
            return false;
        }
        const userPassword = await this.bcryptService.createHashPassword(command.body.password);

        const newUser: User = User.createUser(command.body.login, userPassword, command.body.email);
        return this.userRepository.insertUser(newUser);
    }
}