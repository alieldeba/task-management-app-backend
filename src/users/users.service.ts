import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dto/CreateUserDto';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

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
        let driver: any;
        try {
            const options = new chrome.Options();
            options.addArguments('--disable-extensions');
            options.addArguments('--headless');

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            await driver.get(link);

            // Wait until the username element is present (with a timeout)
            const usernameElement = await driver.wait(
                until.elementLocated(By.tagName('h1')),
                10000,
            );
            const username = await usernameElement.getText();

            // Adjust the selector as per the actual LinkedIn profile page structure
            const imageElement = await driver.findElement(
                By.css('img.profile-pic'),
            );
            const image = await imageElement.getAttribute('src');

            console.log(username);
            return { username, image };
        } catch (error) {
            console.error(
                'Error occurred while fetching LinkedIn profile:',
                error,
            );
            return {
                username: 'unknown',
                image: 'unknown',
            };
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
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
