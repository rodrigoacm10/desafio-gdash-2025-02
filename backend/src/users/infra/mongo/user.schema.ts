import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type UserRole } from '../../domain/user.entity';

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
