import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role!: Role;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ default: false })
  isSuspended!: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  avatarPublicId?: string;

  @Prop()
  verificationDocument?: string;

  @Prop()
  verificationDocPublicId?: string;

  @Prop()
  hashedRefreshToken?: string;

  @Prop({ type: Object })
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1 });
UserSchema.index({ isVerified: 1 });

UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.hashedRefreshToken;
    return ret;
  },
});
