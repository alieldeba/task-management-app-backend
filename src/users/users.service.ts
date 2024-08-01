import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dto/CreateUserDto';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findLinkedinProfile(link: string): Promise<any> {
        const chromeDriverPath = path.resolve('../chromedriver.exe');
        const options = new chrome.Options(); //! Application throws error here

        options.addArguments('headless');
        options.addArguments('disable-gpu');
        options.addArguments('no-sandbox');
        options.addArguments('disable-dev-shm-usage');

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
            .build();

        try {
            await driver.get(link);

            await driver.wait(
                until.elementLocated(
                    By.css(
                        "button[data-tracking-control-name='auth_wall_desktop_profile-login-toggle']",
                    ),
                ),
                10000,
            );

            // Optionally, log in if required
            await driver
                .findElement(
                    By.css(
                        "button[data-tracking-control-name='auth_wall_desktop_profile-login-toggle']",
                    ),
                )
                .click();

            await driver.wait(
                until.elementLocated(By.id('session_key')),
                10000,
            );
            await driver.wait(
                until.elementLocated(By.id('session_password')),
                10000,
            );
            await driver.wait(
                until.elementLocated(By.id('button[type="submit"]')),
                10000,
            );

            await driver.findElement(By.id('session_key')).sendKeys('<email>');

            await driver
                .findElement(By.id('session_password'))
                .sendKeys('<password>');

            await driver.findElement(By.css('button[type="submit"]')).click();

            await driver.wait(until.elementLocated(By.css('h1')), 10000);

            // Find the <h1> element and get its text
            const nameElement = await driver.findElement(By.css('h1'));
            const username = await nameElement.getText();

            return { username };
        } catch (error: any) {
            return { error: error.message };
        } finally {
            await driver.quit();
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
