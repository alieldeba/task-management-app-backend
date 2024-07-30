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
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/CreateUserDTO';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(
        @Body()
        createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.usersService.create(createUserDto);
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
