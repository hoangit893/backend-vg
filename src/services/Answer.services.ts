import { Request, Response } from "express";
import Question from "../models/Question.model";

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
    case "single-choice": {
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
    }
    case "multi-choice": {
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
        correctAnswersId.every((val: any) => userAnswer.includes(val))
      ) {
        isCorrect = true;
      }

      break;
    }
    case "arrange":
      // console.log(answer);
      // console.log(userAnswer);
      userAnswer.split(" ").forEach((word: string, index: number) => {
        if (answer[index].value !== word) {
          console.log(answer[index].value, word);
          isCorrect = false;
          return;
        }
        isCorrect = true;
      });
      break;
    default:
      res.status(400).send("Invalid question type");
      return;
  }

  res.status(200).send({ isCorrect: isCorrect });
};

export { checkAnswerService };
