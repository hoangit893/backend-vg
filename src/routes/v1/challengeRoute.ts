import express, { Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import {
  createChallenge,
  getChallenge,
} from "../../controllers/Challenge.controller";
import {
  getQuestions,
  getQuestion,
} from "../../controllers/Question.controller";
const challengeRoute = express.Router();

challengeRoute.get("/", auth, (req: Request, res: Response) => {
  if (req.headers.role !== "admin" && req.headers.role !== "user") {
    res.status(401).send("Unauthorized");
    return;
  }
  getChallenge(req, res);
});

challengeRoute.post("/create", auth, (req: Request, res: Response) => {
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

challengeRoute.get(
  "/:challengeId/questions",
  auth,
  (req: Request, res: Response) => {
    getQuestions(req, res);
  }
);

challengeRoute.get(
  "/:challengeId/detail",
  auth,
  (req: Request, res: Response) => {
    getChallenge(req, res);
  }
);

challengeRoute.get(
  "/:challengeId/:index",
  auth,
  (req: Request, res: Response) => {
    getQuestion(req, res);
  }
);

export default challengeRoute;
