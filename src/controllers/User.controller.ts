import { Request, Response } from "express";
import dayjs from "dayjs";
import {
  createUserService,
  forgotPasswordService,
  isExistUser,
  loginUserService,
  resetPasswordService,
  updateUserService,
  // forgotPasswordService,
  // resetPasswordService,
} from "../services/User.services";

import { registerValidation } from "../helpers/validation_schema";
import User from "../models/User.model";

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

const updateUser = async (req: Request, res: Response) => {
  if (!req.headers.username) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const username = req.headers.username.toString();

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(500).json({ message: "Internal Error" });
    return;
  }

  const id = user?._id.toString();

  const { name, email, password, avatarImg, bio } = req.body;
  const updateData = { name, email, password, avatarImg, bio };

  const response = await updateUserService(id, updateData);
  res
    .status(response.status)
    .json({ message: response.message, data: response.data });
};

const getVistingUser = async (req: Request, res: Response) => {
  const now = dayjs().subtract(5, "minute").unix();
  const activeUser = await User.countDocuments({ lastVisit: { $gt: now } });
  console.log(await User.find({ lastVisit: { $gt: now } }));
  res.status(200).json({ activeUser });
};

export {
  createUser,
  loginUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getVistingUser,
};
