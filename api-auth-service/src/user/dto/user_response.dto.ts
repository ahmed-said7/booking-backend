import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole } from '../user.schema.js';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  full_name: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;
}