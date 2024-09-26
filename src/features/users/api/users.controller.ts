import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, UseGuards } from "@nestjs/common";
import { TypeUserPagination, UserInputModel } from "./models/input.models";
import { PaginatorUserViewModel, UserViewModel } from "./models/output.models";
import { UserService } from "../application/user.service";
import { UserQueryRepository } from "../repository/user.query-repository";
import { BasicAuthGuard } from "src/infrastructure/guards/basic.guard";
import { BasicGuard } from "src/infrastructure/guards/dubl-guards/basic-auth.guard";
import { CreateUserCommand} from "../application/use-cases/create-user";
import { CommandBus } from "@nestjs/cqrs";

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UserController {
    constructor(
        protected userService: UserService,
        protected userQueryRepository: UserQueryRepository,
        private commandBus: CommandBus) {}

    @Get()
    async getUsers(@Query() query: TypeUserPagination) {
        const users: PaginatorUserViewModel = await this.userQueryRepository.getAllUsers(query);
        return users;
    }
    @Post()
    async createUser(@Body() body: UserInputModel) {
        // const createResult = await this.userService.createUser(body);
        // const createResult = await this.createUserUseCase.execute(body);
        const createResult = await this.commandBus.execute(new CreateUserCommand(body));
        if (!createResult) {
            throw new BadRequestException({ errorsMessages: [{ message: 'email and login should be unique', field: 'email and login' }] })
        }
        const newUserDB: UserViewModel | null = await this.userQueryRepository.getUserById(createResult);
        return newUserDB;
    }
    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
        const deleteResult = await this.userService.deleteUser(id);
        if (!deleteResult) {
            throw new NotFoundException('User is not found');
        }
    }
}