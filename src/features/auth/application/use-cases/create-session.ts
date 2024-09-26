// import { CommandHandler } from "@nestjs/cqrs";
// import { JwtService } from "src/infrastructure/adapters/jwt.service";
// import { Session } from "src/features/sessions/domain/session.entity";
// import { SessionRepository } from "src/features/sessions/repository/session.repository";

// export class CreateSessionCommand {
//     constructor(
//         public userId: string, 
//         public token: string, 
//         public userAgent: string, 
//         public ip: string
//     ) {}
// }

// @CommandHandler(CreateSessionCommand)
// export class CreateSessionUseCase {
//     constructor(
//         private jwtService: JwtService,
//         private sessionRepository: SessionRepository
//     ) {}

//     async execute(command: CreateSessionCommand) {
//         const {ip, token, userAgent, userId} = command
        
//         const payload = this.jwtService.getUserIdByToken(token);
//         let { iat, exp, deviceId } = payload!;
//         iat = new Date(iat * 1000).toISOString();// вынести в createSession
//         exp = new Date(exp * 1000).toISOString();// вынести в createSession

//         const newSession: Session = Session.createSession(userId, deviceId, iat, exp, userAgent, ip);
//         await this.sessionRepository.createSession(newSession);
//     }
// }