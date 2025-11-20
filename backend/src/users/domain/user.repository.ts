import { User, UserRole } from './user.entity';

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<User>;

  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      passwordHash: string;
      role: UserRole;
    }>,
  ): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
