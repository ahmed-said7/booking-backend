import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user_response.dto.js';
import { RedisService } from '../redis/redis.service.js';
import { UserCreatedPublisher } from './publisher/user-created-publisher.service.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
    private readonly userCreatedPublisher: UserCreatedPublisher,
  ) {}

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
      isDeleted: false,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    };

    const user = await this.userModel.create({
      email: createUserDto.email,
      phone: createUserDto.phone,
      full_name: createUserDto.full_name,
      role: UserRole.GUEST,
    });

    const result =  plainToInstance(UserResponseDto, {
      ...user.toObject(),
      id: user._id.toString(),
    }, {
      excludeExtraneousValues: true,
    });

    await this.redisService.set(`user:${result.id}`, JSON.stringify(result), 60);


    await this.userCreatedPublisher.publish(result);

    return result;
  }

  async findOne(id: string) {
    const cachedUser = await this.redisService.get(`user:${id}`);
    
    if (cachedUser) {
      return plainToInstance(UserResponseDto, JSON.parse(cachedUser), {
        excludeExtraneousValues: true,
      });
    }
    
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log('User fetched from database:', user);

    const result = plainToInstance(UserResponseDto, {
      ...user.toObject(),
      id: user._id.toString(),
    }, {
      excludeExtraneousValues: true,
    });

    await this.redisService.set(`user:${id}`, JSON.stringify(result), 60);

    return result;
  }

  async remove(id: string) {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
      );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.redisService.del(`user:${id}`);

    return {
      message: 'User deleted successfully',
    };
  }
}
