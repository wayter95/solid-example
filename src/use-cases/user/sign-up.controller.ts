import { Request, Response } from "express";
import { ISignUpUseCase } from "./interface-sign-up.use-case";

class SignUpController {
  constructor(private readonly signUpUseCase: ISignUpUseCase) { }

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const requiredFields = ["name", "email", "password"]

      for(const field of requiredFields) {
        if(!request.body[field]) {
          return response.status(400).json({
            message: `Field ${field} params is required.`,
            error: "Bad request"
          })
        }
      }

      const { name, email, password } = request.body;

      const user = await this.signUpUseCase.handle({ name, email, password });

      return response.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      return response.status(500).json({ message: 'Error creating user', error });
    }
  }
}

export { SignUpController };
