import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../schemas/task.schema';
import { AuthGuard } from '../guards/auth.guard';
import { RequestPayload } from '../types';
import { CreateTaskDto } from './dto/CreateTaskDto';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async findAll(@Request() request: RequestPayload): Promise<Task[]> {
        return this.tasksService.findAll(request.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Task> {
        return this.tasksService.findOne(id);
    }

    @Post()
    async create(
        @Request() request: RequestPayload,
        @Body()
        createTaskDto: CreateTaskDto,
    ): Promise<Task> {
        return this.tasksService.create(request.user.userId, createTaskDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() taskData: Partial<Task>,
    ): Promise<Task> {
        return this.tasksService.update(id, taskData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Task> {
        return this.tasksService.delete(id);
    }
}
