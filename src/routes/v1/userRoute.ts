import express, { Request, Response } from "express";
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getVistingUser,
} from "../../controllers/User.controller";
import { auth } from "../../middlewares/auth";
import { findByUsername } from "../../services/User.services";
import User from "../../models/User.model";
import hideSensitiveData from "../../helpers/hideSensitiveData";
const userRoute = express.Router();

userRoute.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// userRoute.get("/", (req: Request, res: Response) => {
//   res.send("Hello World");
// });

userRoute.post("/create", (req: Request, res: Response) =>
  createUser(req, res)
);

userRoute.post("/login", (req: Request, res: Response) => {
  try {
    loginUser(req, res);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

userRoute.put("/update", auth, (req: Request, res: Response) => {
  updateUser(req, res);
});

userRoute.post("/forgotpassword", (req: Request, res: Response) =>
  forgotPassword(req, res)
);

userRoute.post("/resetpassword", (req: Request, res: Response) => {
  resetPassword(req, res);
});

userRoute.get("/auth", auth, async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Authorized",
    username: req.body.username,
    role: req.headers.role,
    user: await findByUsername(
      req.headers.username ? req.headers.username.toString() : ""
    ),
  });
});

userRoute.get("/active", (req: Request, res: Response) => {
  getVistingUser(req, res);
});

userRoute.get("/profile", auth, async (req: Request, res: Response) => {
  const username = req.headers.username;
  if (!username) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const hideSensitive = hideSensitiveData(user);
  res.status(200).json({ user: hideSensitive });
});

export default userRoute;
