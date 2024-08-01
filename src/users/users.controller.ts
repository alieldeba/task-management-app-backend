import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('/linkedin-profile')
    async findLinkedinProfile(
        @Body() link: string,
    ): Promise<{ username: string; image: string }> {
        return this.usersService.findLinkedinProfile(link);
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
