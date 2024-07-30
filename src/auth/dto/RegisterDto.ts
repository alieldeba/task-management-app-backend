import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsUrl()
    linkedinURL: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
