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

const checkAnswerService = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  const userAnswer = req.body.userAnswer;
  let isCorrect = false;

  if (!questionId) {
    res.status(400).send("Missing fields");
    return;
  }

  const question = await Question.findOne({ _id: questionId });

  if (!question) {
    res.status(400).send("Question not found");
    return;
  }

  let answer = question.answerList;
  const questionType = question.type;

  switch (questionType) {
    case "single-choice":
      if (userAnswer.length !== 1) {
        res.status(400).send("Just 1 selection is allowed");
        return;
      }

      let correctAnswer = answer
        .find((ans) => ans.isCorrect === true)
        ?._id?.toString();

      if (correctAnswer && correctAnswer === userAnswer[0]) {
        isCorrect = true;
      }
      break;
    case "multi-choice":
      if (userAnswer.length <= 1) {
        res.status(400).send("No selection found");
        return;
      }

      let correctAnswers = answer.filter((ans) => ans.isCorrect === true);
      if (!correctAnswers) {
        res.status(400).send("No correct answer found");
        return;
      }

      let correctAnswersId = correctAnswers.map((ans) => {
        if (ans._id) return ans._id.toString();
      });

      if (
        correctAnswersId.length === userAnswer.length &&
        correctAnswersId.every((val) => userAnswer.includes(val))
      ) {
        isCorrect = true;
      }

      break;
    case "arrange":
      break;
    default:
      res.status(400).send("Invalid question type");
      return;
  }

  res.status(200).send({ isCorrect: isCorrect });
};

export { createAnswerService, checkAnswerService };
