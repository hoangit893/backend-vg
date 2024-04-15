import express, { Request, Response } from "express";

const answerRoute = express.Router();
import {
  checkAnswerService,
  checkAnswerServiceV2,
} from "../../services/Answer.services";
import { auth } from "../../middlewares/auth";

answerRoute.get("/:questionId", (req: Request, res: Response) => {
  checkAnswerService(req, res);
});

answerRoute.post("/:questionId", auth, (req: Request, res: Response) => {
  checkAnswerServiceV2(req, res);
});

export default answerRoute;
