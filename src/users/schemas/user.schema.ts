import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
    tasks: MongooseSchema.Types.ObjectId[]; // Optional: Array of task references
}

export const UserSchema = SchemaFactory.createForClass(User);
