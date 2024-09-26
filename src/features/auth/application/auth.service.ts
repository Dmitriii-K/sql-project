import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    constructor() {}

    // async checkCredentials(loginOrEmail: string) {
    //     const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    //     if (user) {
    //         return user;
    //     } else {
    //         return null;
    //     }
    // }

    // async registerUser(data: UserInputModel) {
    //     const checkUser = await this.authRepository.checkUserByRegistration(data.login, data.email);
    //     if (checkUser !== null) return;
    //     const password = await this.bcryptService.createHashPassword(data.password); //создать хэш пароля
    //     const newUserForRegistration: User = User.createUserForRegistration(data.login, password, data.email);
    //     await this.authRepository.createUser(newUserForRegistration); // сохранить юзера в базе данных
    //     this.emailService.sendMail(newUserForRegistration.email, newUserForRegistration.emailConfirmation.confirmationCode);
    //     return newUserForRegistration;
    // }

    // async updateRefreshToken(user: MeViewModel, deviceId: string) {
    //     const newPairTokens = this.jwtService.generateToken(user, deviceId);
    //     const { accessToken, refreshToken } = newPairTokens;
    //     const payload = this.jwtService.getUserIdByToken(refreshToken);
    //     if (!payload) throw new Error('пейлода нет, хотя он должен быть после создания новой пары');
    //     let { iat } = payload;
    //     iat = new Date(iat * 1000).toISOString();
    //     await this.authRepository.updateIat(iat, deviceId);
    //     return { accessToken, refreshToken };
    // }

    // async createSession(userId: string, token: string, userAgent: string, ip: string) {
    //     const payload = this.jwtService.getUserIdByToken(token);
    //     let { iat, exp, deviceId } = payload!;
    //     iat = new Date(iat * 1000).toISOString();
    //     exp = new Date(exp * 1000).toISOString();
    //     const newSession: Session = Session.createSession(userId, deviceId, iat, exp, userAgent, ip);
    //     await this.authRepository.createSession(newSession);
    // }

    // async authLogoutAndDeleteSession(deviceId: string) {
    //     const deletedSession = await this.sessionRepository.deleteSession(deviceId);
    //     if (deletedSession) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // async newPassword(data: NewPasswordRecoveryInputModel): Promise<boolean> {
    //     // Проверяем, существует ли пользователь с таким кодом восстановления
    //     const user: UserDocument | null = await this.authRepository.findUserByCode(data.recoveryCode);
    //     if (!user) return false; // Пользователь не найден или код недействителен
    //     if (user.emailConfirmation.confirmationCode !== data.recoveryCode) return false;
    //     // Хешируем новый пароль
    //     const password = await this.bcryptService.createHashPassword(data.newPassword);
    //     // Обновляем пароль пользователя
    //     const result = await this.authRepository.updatePassword(user._id.toString(), password);
    //     if (result) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // async passwordRecovery(mail: string): Promise<boolean> {
    //     // Проверяем, существует ли пользователь с таким email
    //     const user: UserDocument | null = await this.authRepository.findUserByEmail(mail);
    //     if (!user) {
    //         throw new BadRequestException();
    //     } // Пользователь не найден
    //     // Генерируем код восстановления
    //     const recoveryCode = randomUUID();
    //     await this.authRepository.updateCode(user.id, recoveryCode);
    //     await this.emailService.sendPasswordRecoveryMail(mail, recoveryCode);
    //     return true;
    // }

    // async confirmEmail(code: string) {
    //     const user: UserDocument | null = await this.userRepository.findUserByCode(code);
    //     if (!user) {
    //         throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
    //     }
    //     if (user.emailConfirmation.isConfirmed) {
    //         throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "code" } });
    //     }
    //     if (user.emailConfirmation.confirmationCode !== code) {
    //         throw new BadRequestException({ errorsMessages: { message: "This code is incorrect", field: "code" } });
    //     }
    //     if (user.emailConfirmation.expirationDate < new Date().toISOString()) {
    //         throw new BadRequestException({ errorsMessages: { message: "Expiration date is over", field: "code" } });
    //     }
    //     const result = await this.userRepository.updateConfirmation(user.id);
    //     return result;
    // }

    // async resendEmail(mail: string) {
    //     const user: UserDocument | null = await this.authRepository.findUserByEmail(mail);
    //     if (!user) {
    //         throw new BadRequestException({ errorsMessages: { message: "This email is incorrect", field: "email" } });
    //     }
    //     if (user.emailConfirmation.isConfirmed) {
    //         throw new BadRequestException({ errorsMessages: { message: "This field is verified", field: "email" } });
    //     }
    //     const newCode = randomUUID();
    //     await this.authRepository.updateCode(user.id, newCode),
    //     this.emailService.sendMail(mail, newCode)
    //     return true;
    // }
}