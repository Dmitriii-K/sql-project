import { Module } from "@nestjs/common";
import { SessionController } from "./api/session.controller";
import { SessionsService } from "./application/session.service";
import { SessionsQueryRepository } from "./repository/session.sql.query-repository";
import { SessionRepository } from "./repository/session.sql.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Session, SessionSchema } from "./domain/session.entity";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        UsersModule,// почему???
        MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])
    ],
    controllers: [SessionController],
    providers: [SessionsService, SessionRepository, SessionsQueryRepository],
    exports: [SessionRepository]
})
export class SessionsModule {}