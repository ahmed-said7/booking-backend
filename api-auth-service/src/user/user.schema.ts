import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

export enum UserRole {
  GUEST = 'GUEST',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class User {
  @Prop({
    type: String,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
  })
  phone?: string;

  @Prop({
    type: String,
    trim: true,
  })
  full_name: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
