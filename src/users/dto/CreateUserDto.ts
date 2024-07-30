import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsUrl()
    linkedinURL: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNotEmpty()
    password: string;
}
