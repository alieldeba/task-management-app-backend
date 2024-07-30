import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Task } from './task.schema';
import { Category } from './category.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    linkedinURL: string;

    @Prop({ required: true })
    password: string;

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }])
    tasks: Task[];

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }])
    categories: Category[];
}

export const UserSchema = SchemaFactory.createForClass(User);
