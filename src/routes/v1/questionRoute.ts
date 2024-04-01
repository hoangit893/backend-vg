import express, { Request, Response } from "express";
import {
  createQuestion,
  getQuestions,
  deleteQuestion,
  updateQuestion,
} from "../../controllers/Question.controller";
import { auth } from "../../middlewares/auth";

const questionRoute = express.Router();

questionRoute.post("/create", (req: Request, res: Response) =>
  createQuestion(req, res)
);

questionRoute.get("/", auth, (req: Request, res: Response) => {
  getQuestions(req, res);
});

questionRoute.put(
  "/update/:questionId",
  auth,
  (req: Request, res: Response) => {
    updateQuestion(req, res);
  }
);

questionRoute.delete(
  "/delete/:questionId",
  auth,
  (req: Request, res: Response) => {
    deleteQuestion(req, res);
  }
);

export default questionRoute;
