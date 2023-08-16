import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";
import { ISignUpUseCase, ISignUpUseCaseRequest } from "./interface-sign-up.use-case";


class SignUpUseCase implements ISignUpUseCase {
  constructor (private readonly userRepository: UserRepository) {}

  async handle(request: ISignUpUseCaseRequest): Promise<User> {
    const userExist = await this.userRepository.findByEmail(request.email);

    if(userExist) {
      throw new Error("User already exists.")
    }

    const user = new User(request)
    
    await this.userRepository.create(user);

    return user;
  }
}

export {SignUpUseCase}