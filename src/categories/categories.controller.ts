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
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.findOne(id);
    }

    @Post()
    async create(
        @Request() request,
        @Body()
        categoryData: {
            name: string;
        },
    ): Promise<Category> {
        return this.categoriesService.create(
            request.user.userId,
            categoryData.name,
        );
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() categoryData: Partial<Category>,
    ): Promise<Category> {
        return this.categoriesService.update(id, categoryData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Category> {
        return this.categoriesService.delete(id);
    }
}
