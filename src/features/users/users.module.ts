import { Module } from "@nestjs/common";
import { UserController } from "./api/users.controller";
import { UserService } from "./application/user.service";
import { UserRepository } from "./repository/users-sql-repository";
import { UserQueryRepository } from "./repository/users-sql-query-repository";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./domain/user.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { AdaptersModule } from "src/infrastructure/adapters/adapters.module";

@Module({
    imports: [CqrsModule, AdaptersModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserQueryRepository],
    exports: [UserRepository, UserService]
})
export class UsersModule {
}