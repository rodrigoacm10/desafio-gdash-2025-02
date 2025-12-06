export type UserRole = 'admin' | 'user';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole = 'user',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
