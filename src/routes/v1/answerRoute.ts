import express, { Request, Response } from "express";

const answerRoute = express.Router();
import { checkAnswerService } from "../../services/Answer.services";

answerRoute.get("/:questionId", (req: Request, res: Response) => {
  checkAnswerService(req, res);
});

export default answerRoute;
