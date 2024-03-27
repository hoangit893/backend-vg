import express, { Request, Response } from "express";
import { auth } from "../middlewares/auth";
import {
  createChallenge,
  getChallenge,
} from "../controllers/Challenge.controller";
import { getQuestions, getQuestion } from "../controllers/Question.controller";
const challangeRoute = express.Router();

challangeRoute.get("/", auth, (req: Request, res: Response) => {
  if (req.headers.role !== "admin" && req.headers.role !== "user") {
    res.status(401).send("Unauthorized");
    return;
  }
  getChallenge(req, res);
});

challangeRoute.post("/create", auth, (req: Request, res: Response) => {
  if (!req.headers.role) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.headers.role !== "admin") {
    res.status(401).send("Forbidden");
    return;
  }
  createChallenge(req, res);
});

challangeRoute.get(
  "/:challengeId/questions",
  auth,
  (req: Request, res: Response) => {
    getQuestions(req, res);
  }
);

challangeRoute.get(
  "/:challengeId/:index",
  auth,
  (req: Request, res: Response) => {
    getQuestion(req, res);
  }
);

export default challangeRoute;
