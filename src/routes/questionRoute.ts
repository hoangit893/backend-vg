import express, { Request, Response } from "express";
import { createQuestion } from "../controllers/Question.controller";

const questionRoute = express.Router();

questionRoute.post("/create", (req: Request, res: Response) =>
  createQuestion(req, res)
);

export default questionRoute;
