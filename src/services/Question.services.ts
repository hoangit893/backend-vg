import { Request, Response } from "express";
import Question from "../models/Question.model";
import Challenge from "../models/Challenge.model";
import { stat } from "fs";

const createQuestionService = async (
  type: String,
  question: String,
  challengeId: any,
  answerList: Array<{
    value: String;
    isCorrect: Boolean;
  }>
) => {
  try {
    const newQuestion = new Question({
      type,
      question,
      challengeId,
      answerList,
    });
    newQuestion.save();
    return {
      status: 200,
      message: {
        message: "Question created",
        data: newQuestion,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      message: {
        error: error.message,
      },
    };
  }
};

export { createQuestionService };
