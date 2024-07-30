import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNotEmpty()
    @IsIn(['Todo', 'Working', 'Done'])
    status: string;

    @IsNotEmpty()
    dueDate: Date;
}
