import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Category } from './category.schema';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ enum: ['Todo', 'Working', 'Done'], default: 'Todo' })
    status: string;

    @Prop()
    dueDate: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: User;

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }])
    categories: Category[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
