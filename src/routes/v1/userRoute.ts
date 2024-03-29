import express, { Request, Response } from "express";
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUser,
} from "../../controllers/User.controller";
import { auth } from "../../middlewares/auth";
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

userRoute.post("/login", (req: Request, res: Response) => loginUser(req, res));

userRoute.put("/update", auth, (req: Request, res: Response) => {
  updateUser(req, res);
});

userRoute.post("/forgotpassword", (req: Request, res: Response) =>
  forgotPassword(req, res)
);

userRoute.post("/resetpassword", (req: Request, res: Response) => {
  resetPassword(req, res);
});

userRoute.post("/auth", auth, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Authorized",
    username: req.body.username,
  });
});
export default userRoute;
