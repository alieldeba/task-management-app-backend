import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async getAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async getOne(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    // TODO: delete any
    async getOneByUsername(username: string): Promise<any> {
        return this.userModel.findOne({ username }).exec();
    }

    async create(
        username: string,
        email: string,
        linkedinURL: string,
        password: string,
    ): Promise<User> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userModel({
            username,
            email,
            linkedinURL,
            password: hashedPassword,
        });
        return newUser.save();
    }

    async update(id: string, updatedUser: Partial<User>): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(id, updatedUser, { new: true })
            .exec();
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
