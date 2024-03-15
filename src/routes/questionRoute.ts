import express, { Request, Response } from "express";
const questionRoute = express.Router();
import { createQuestionService } from "../services/Question.services";

questionRoute.post("/create", (req: Request, res: Response) =>
  createQuestionService(req, res)
);

export default questionRoute;
