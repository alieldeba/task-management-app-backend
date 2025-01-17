import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsIn(['Todo', 'Working', 'Done'])
    status: string;

    @IsOptional()
    categories: string[];

    @IsNotEmpty()
    dueDate: Date;
}
