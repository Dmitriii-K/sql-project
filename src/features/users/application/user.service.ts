import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { User } from "../domain/user.entity";
import {WithId} from "mongodb"

@Injectable()
export class UserService /*implements IUserService*/{
    constructor(private userRepository: UserRepository) {}

    // async createUser(data: UserInputModel) {
    //     const userExist = await this.userRepository.findUserByLogiOrEmail({ login: data.login, email: data.email });
    //     if (userExist) {
    //         return false;
    //     }
    //     const userPassword = await this.bcryptService.createHashPassword(data.password);

    //     const newUser: User = User.createUser(data.login, userPassword, data.email);
    //     return this.userRepository.insertUser(newUser);
    //     // return this.userRepository.saveUser(newUser);
    // }
    async deleteUser(id: string) {
        return this.userRepository.deleteUser(id);
    }
    async validateUser(login: string, pass: string): Promise<WithId<User> | null> {
        return this.userRepository.findOne(login);
    }
}