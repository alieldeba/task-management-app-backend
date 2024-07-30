import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string): Promise<Category> {
        return this.categoryModel.findById(id).exec();
    }

    async create(
        userId: string,
        createCategoryDto: CreateCategoryDto,
    ): Promise<Category> {
        const newCategory = new this.categoryModel({
            userId,
            ...createCategoryDto,
        });
        return newCategory.save();
    }

    async update(
        id: string,
        updatedCategory: Partial<Category>,
    ): Promise<Category> {
        return this.categoryModel
            .findByIdAndUpdate(id, updatedCategory, { new: true })
            .exec();
    }

    async delete(id: string): Promise<Category> {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}
