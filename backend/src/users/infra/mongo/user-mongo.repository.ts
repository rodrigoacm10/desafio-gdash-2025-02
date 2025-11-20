import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { type IUserRepository } from '../../domain/user.repository';
import { User, UserRole } from '../../domain/user.entity';
import { UserDocument } from './user.schema';

export class UserMongoRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private mapToDomain(doc: UserDocument): User {
    return new User(
      doc.id,            
      doc.name,
      doc.email,
      doc.passwordHash,
      doc.role,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<User> {
    const created = await this.userModel.create(data);
    return this.mapToDomain(created);
  }

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((d) => this.mapToDomain(d));
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      passwordHash: string;
      role: UserRole;
    }>,
  ): Promise<User | null> {
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
