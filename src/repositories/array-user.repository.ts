import { User } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

class ArrayUserRepository extends UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
   this.users.push(user);

   return user
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email)

    if(!user) {
      return null;
    }

    return user;
  }
}

export { ArrayUserRepository }