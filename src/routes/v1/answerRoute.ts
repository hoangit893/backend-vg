import express, { Request, Response } from "express";

const answerRoute = express.Router();
import {
  createAnswerService,
  getAnswerService,
} from "../../services/Answer.services";

answerRoute.post("/create", (req: Request, res: Response) =>
  createAnswerService(req, res)
);

answerRoute.get("/:questionId", (req: Request, res: Response) => {
  getAnswerService(req, res);
});

export default answerRoute;
