import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        password: string,
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.getOneByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = {
            userId: user._id,
            email: user.email,
            username: user.username,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async register(
        username: string,
        email: string,
        linkedinURL: string,
        password: string,
    ): Promise<{ message: string; user: User }> {
        const user = await this.usersService.create(
            username,
            email,
            linkedinURL,
            password,
        );
        return {
            message: 'User registered, Log in to your account',
            user,
        };
    }
}
