import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dto/CreateUserDTO';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel
            .findById(id)
            .populate(['tasks', 'categories'])
            .exec();
    }

    async findOneByEmail(email: string): Promise<any> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return newUser.save();
    }

    @UseGuards(AuthGuard)
    async update(id: string, updatedUser: Partial<User>): Promise<User> {
        // To prevent user from changing his password
        delete updatedUser.password;

        return this.userModel
            .findByIdAndUpdate(id, updatedUser, { new: true })
            .exec();
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
