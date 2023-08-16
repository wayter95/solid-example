import { Router } from "express";
import { SignUpController } from "./use-cases/user/sign-up.controller";
import { SignUpFactory } from "./factories/sign-up.factory";

const routes = Router();

const signUpController = new SignUpController(SignUpFactory.create());

routes.post('/signup', (req, res) => signUpController.handle(req, res));

export {routes}