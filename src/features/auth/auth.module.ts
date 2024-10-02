import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersModule } from "../users/users.module";
import { SessionsModule } from "../sessions/sessions.module";
import { AdaptersModule } from "src/infrastructure/adapters/adapters.module";


@Module({
    imports: [CqrsModule, UsersModule, SessionsModule,
        AdaptersModule
    ],
    controllers: [AuthController],
    providers: [],
    exports: []
})
export class AuthModule {
}