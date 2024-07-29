import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) {}

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async findOne(id: string): Promise<Task> {
        return this.taskModel.findById(id).exec();
    }

    async create(
        user: any,
        name: string,
        description: string,
        status: string,
        dueDate: Date,
    ): Promise<Task> {
        const newTask = new this.taskModel({
            user,
            name,
            description,
            status,
            dueDate,
        });
        return newTask.save();
    }

    async update(id: string, updatedTask: Partial<Task>): Promise<Task> {
        return this.taskModel
            .findByIdAndUpdate(id, updatedTask, { new: true })
            .exec();
    }

    async delete(id: string): Promise<Task> {
        return this.taskModel.findByIdAndDelete(id).exec();
    }
}
