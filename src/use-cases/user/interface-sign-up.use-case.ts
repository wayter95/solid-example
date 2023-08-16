import { User } from "../../entities/user.entity";

interface ISignUpUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

abstract class ISignUpUseCase {
  abstract handle(request: ISignUpUseCaseRequest): Promise<User>
}

export {ISignUpUseCase, ISignUpUseCaseRequest}