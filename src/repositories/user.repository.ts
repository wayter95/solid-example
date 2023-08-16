import { User } from "../entities/user.entity";

abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}

export {UserRepository}