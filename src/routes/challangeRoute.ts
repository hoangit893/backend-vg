import express, { Request, Response } from "express";
import { auth } from "../middlewares/auth";
import { authManager } from "../middlewares/authManager";
import { createChallenge } from "../controllers/Challenge.controller";
const challangeRoute = express.Router();

challangeRoute.post("/create", authManager, (req: Request, res: Response) =>
  createChallenge(req, res)
);

challangeRoute.get("/:challengeId", auth, (req: Request, res: Response) => {
  res.send(req.params.challengeId);
});

export default challangeRoute;
