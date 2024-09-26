// import { CommandHandler } from "@nestjs/cqrs";
// import { JwtService } from "src/infrastructure/adapters/jwt.service";
// import { MeViewModel } from "../../api/models/output.model";
// import { SessionRepository } from "src/features/sessions/repository/session.repository";

// export class UpdateRefreshTokenCommand {
//     constructor(
//         public user: MeViewModel, 
//         public deviceId: string
//     ) {}
// }

// @CommandHandler(UpdateRefreshTokenCommand)
// export class UpdateRefreshTokenUseCase {
//     constructor(
//         private sessionRepository: SessionRepository,
//         private jwtService: JwtService
//     ) {}

//     async execute(command: UpdateRefreshTokenCommand) {
//         const {user, deviceId} = command
        
//         const newPairTokens = this.jwtService.generateToken(user, deviceId);
//         const { accessToken, refreshToken } = newPairTokens;
//         const payload = this.jwtService.getUserIdByToken(refreshToken);
//         if (!payload) throw new Error('пейлода нет, хотя он должен быть после создания новой пары');
//         let { iat } = payload;
//         iat = new Date(iat * 1000).toISOString();
//         await this.sessionRepository.updateIat(iat, deviceId);
//         return { accessToken, refreshToken };
//     }
// }