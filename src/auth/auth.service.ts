import { RegisterDto } from './dto/RegisterDto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(
        loginDto: LoginDto,
    ): Promise<{ access_token: string; user: User }> {
        const { email, password } = loginDto;
        const user: User = await this.usersService.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = {
            userId: user._id,
            email: user.email,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user,
        };
    }

    async register(
        registerDto: RegisterDto,
    ): Promise<{ message: string; user: User }> {
        const user = await this.usersService.create(registerDto);
        return {
            message: 'User registered, Log in to your account',
            user,
        };
    }
}
