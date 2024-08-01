import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string): Promise<Category> {
        return this.categoryModel.findById(id).exec();
    }

    async findCategoriesByUser(id: string): Promise<Category[]> {
        return this.categoryModel.find({ userId: id }).exec();
    }

    async create(
        userId: string,
        createCategoryDto: CreateCategoryDto,
    ): Promise<Category> {
        const currentUser = await this.userModel.findById(userId);
        const newCategory = new this.categoryModel({
            ...createCategoryDto,
            userId,
        });
        const savedCategory = await newCategory.save();

        // add category to user's data object
        await currentUser.updateOne({
            $push: {
                categories: savedCategory._id,
            },
        });

        return savedCategory;
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
