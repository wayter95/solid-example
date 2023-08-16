import { ArrayUserRepository } from "../repositories/array-user.repository";
import { SignUpUseCase } from "../use-cases/user/sign-up.use-case";

class SignUpFactory {
  static create(): SignUpUseCase {
    const userRepository = new ArrayUserRepository();
    return new SignUpUseCase(userRepository);
  }
}

export { SignUpFactory };
