import { Request, Response } from "express";
import {
  createUserService,
  findByUsername,
  forgotPasswordService,
  isExistUser,
  loginUserService,
  resetPasswordService,
  // forgotPasswordService,
  // resetPasswordService,
} from "../services/User.services";

import { registerValidation } from "../helpers/validation_schema";

const createUser = async (req: Request, res: Response) => {
  const newUser: {
    name: string;
    username: string;
    password: string;
    email: string;
  } = req.body;
  const { error } = registerValidation.validate(newUser);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const isExist = await isExistUser(newUser.username, newUser.email);
  if (isExist) {
    res.status(400).json({ message: "User already exist" });
    return;
  } else {
    const response = await createUserService(req.body);
    res.status(response.status).json(response.message);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const loginInfo: { username: string; password: string } = req.body;
  const response = await loginUserService(loginInfo);
  res.status(response.status).json(response.message);
};
const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const response = await forgotPasswordService(email);
  console.log(response);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const response = await resetPasswordService({ token, password });
  res.status(response.status).json(response.message);
};

export { createUser, loginUser, forgotPassword, resetPassword };
