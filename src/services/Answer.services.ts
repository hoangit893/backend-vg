import Answer from "../models/Answer.model";
import { Request, Response } from "express";
import Question from "../models/Question.model";

const createAnswerService = async (req: Request, res: Response) => {
  const { value, isCorrect, questionId } = req.body;

  if (!value || !isCorrect || !questionId) {
    res.status(400).send("Missing fields");
    return;
  }

  const question = await Question.findOne({ _id: questionId });

  if (question === null) {
    res.status(400).send("Question not found");
    return;
  }

  const answer = new Answer({
    value,
    isCorrect,
    questionSchema: questionId,
  });

  answer.save();
  res.status(200).send("Answer created !!");
};

const getAnswerService = async (req: Request, res: Response) => {
  const { questionId } = req.body;

  if (!questionId) {
    res.status(400).send("Missing fields");
    return;
  }

  const answer = await Answer.find({ questionSchema: questionId });
  let answerList: string[] = [];

  answer.forEach((ans) => {
    answerList.push(ans.value);
  });

  if (!answer) {
    res.status(400).send("Answer not found");
    return;
  }

  res.status(200).send(answerList);
};

export { createAnswerService, getAnswerService };
