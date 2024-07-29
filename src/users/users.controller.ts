import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll(): Promise<User[]> {
        return this.usersService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<User> {
        return this.usersService.getOne(id);
    }

    @Post()
    async create(
        @Body()
        userData: {
            username: string;
            email: string;
            linkedinURL: string;
            password: string;
        },
    ): Promise<User> {
        return this.usersService.create(
            userData.username,
            userData.email,
            userData.linkedinURL,
            userData.password,
        );
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() userData: Partial<User>,
    ): Promise<User> {
        return this.usersService.update(id, userData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<User> {
        return this.usersService.delete(id);
    }
}
