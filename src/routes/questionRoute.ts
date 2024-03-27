import express, { Request, Response } from "express";
import {
  createQuestion,
  getQuestions,
} from "../controllers/Question.controller";

const questionRoute = express.Router();

questionRoute.post("/create", (req: Request, res: Response) =>
  createQuestion(req, res)
);

questionRoute.get("/", (req: Request, res: Response) => {
  getQuestions(req, res);
});

export default questionRoute;
