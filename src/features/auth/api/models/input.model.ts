import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";


export class LoginInputModel {
    @IsString()
    @Trim()
    @IsNotEmpty()
    loginOrEmail: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    password: string;
}

export class RegistrationEmailResending {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    @IsEmail()
    email: string;
}

export class NewPasswordRecoveryInputModel {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(6,20)
    newPassword: string;

    @IsString()
    @Trim()
    @IsNotEmpty()
    recoveryCode: string
}

export class RegistrationConfirmationCodeModel {
    @IsString()
    @Trim()
    @IsNotEmpty()
    code: string;
}

export interface RequestUserDTO  {
    login: string,
    email: string,
    userId: string
}