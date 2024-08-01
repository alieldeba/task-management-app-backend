import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dto/CreateUserDTO';
import { By, Builder } from 'selenium-webdriver';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findLinkedinProfile(
        link: string,
    ): Promise<{ username: string; image: string }> {
        try {
            console.log('1');
            const driver = await new Builder().forBrowser('chrome').build();

            await driver.get(link);
            console.log('2');

            const t = await driver.findElement(By.tagName('h1')).getText();
            console.log('3');

            console.log(t);
        } catch (error) {
            console.log(error);
        }

        return {
            username: 'alieldeba',
            image: 'https://github.com/alieldeba.png',
        };
    }

    async findOne(id: string): Promise<User> {
        return await this.userModel
            .findById(id)
            .populate(['tasks', 'categories'])
            .exec();
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return await newUser.save();
    }

    @UseGuards(AuthGuard)
    async update(id: string, updatedUser: Partial<User>): Promise<User> {
        // To prevent user from changing his password
        delete updatedUser.password;

        return await this.userModel
            .findByIdAndUpdate(id, updatedUser, { new: true })
            .exec();
    }

    async delete(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}
