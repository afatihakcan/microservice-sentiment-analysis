import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create (user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async getUserById(id: number): Promise<any> {
    return this.userModel.findById(id).exec();
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<any> {
    return this.userModel.findOne({ email, password }).exec();
  }
}
