import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateTaskDto } from './dto/CreateTaskDto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(userId: string): Promise<Task[]> {
        return await this.taskModel.find({ userId }).exec();
    }

    async findOne(id: string): Promise<Task> {
        return await this.taskModel.findById(id).populate('categories').exec();
    }

    async findTasksByUser(id: string): Promise<Task[]> {
        return await this.taskModel
            .find({ userId: id })
            .populate('categories')
            .exec();
    }

    async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
        const currentUser = await this.userModel.findById(userId);

        const newTask = new this.taskModel({
            ...createTaskDto,
            userId,
        });

        const savedTask = await newTask.save();

        // add task to user's data object
        await currentUser.updateOne({
            $push: {
                tasks: savedTask._id,
            },
        });

        return await savedTask.populate('categories');
    }

    async update(id: string, updatedTask: Partial<Task>): Promise<Task> {
        return await this.taskModel
            .findByIdAndUpdate(id, updatedTask, { new: true })
            .exec();
    }

    async delete(id: string): Promise<Task> {
        return await this.taskModel.findByIdAndDelete(id).exec();
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return await this.taskModel.find({ userId }).exec();
    }
}
