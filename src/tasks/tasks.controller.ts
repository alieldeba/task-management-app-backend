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
import { Task } from './schemas/task.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async getAll(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<Task> {
        return this.tasksService.findOne(id);
    }

    @Post()
    async create(
        @Request() request,
        @Body()
        taskData: {
            name: string;
            description: string;
            status: string;
            dueDate: Date;
        },
    ): Promise<Task> {
        console.log(request.user);
        return this.tasksService.create(
            request.user.userId,
            taskData.name,
            taskData.description,
            taskData.status,
            taskData.dueDate,
        );
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
