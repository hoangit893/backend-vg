import { Request, Response } from "express";
import Challenge from "../models/Challenge.model";
import { createQuestionService } from "../services/Question.services";
import Question from "../models/Question.model";
import { get } from "http";

const createQuestion = async (req: Request, res: Response) => {
  const { type, question, challengeId, answerList } = req.body;

  let error = [];
  if (!type) {
    error.push("Type is required");
  }
  if (!question) {
    error.push("Question is required");
  }
  if (!challengeId) {
    error.push("Challenge name is required");
  }

  if (!answerList || type == "arrange") {
    error.push("Answer list is required");
  }

  if (error.length > 0) {
    res.status(400).json({ message: error });
    return;
  }
  let challenge = await Challenge.findOne({ _id: challengeId });

  if (!challenge) {
    res.status(400).json({ message: "Challenge not found" });
    return;
  }

  let isExistQuestion = await Question.find({
    question: question,
    challengeId: challengeId,
  });

  if (isExistQuestion.length > 0) {
    res.status(400).json({ message: "Question already exists" });
    return;
  }

  const response = await createQuestionService(
    type,
    question,
    challenge._id,
    answerList
  );
  res.status(response.status).json(response.message);
};

const getQuestions = async (req: Request, res: Response) => {
  let challengeId = req.query.challengeId;
  let role = req.headers.role;
  let queries = challengeId ? { challengeId: challengeId } : {};
  let questions = await Question.find(queries).populate("challengeId");
  if (role !== "admin")
    questions.forEach((question) => {
      question.answerList.forEach((answer) => {
        answer.isCorrect = undefined;
      });
    });

  if (questions.length == 0) {
    res.status(400).json({ message: "Questions not found" });
    return;
  }
  res.status(200).json({ questionList: questions });
};

const getQuestion = async (req: Request, res: Response) => {
  let challengeId = req.params.challengeId;
  let index = parseInt(req.params.index, 10);
  let question = await Question.find({ challengeId: challengeId });
  if (question.length == 0) {
    res.status(400).json({ message: "Question not found" });
    return;
  }
  const questionList = await Question.find({ challengeId: challengeId });
  if (index < 0 || index >= questionList.length) {
    res.status(400).json({ message: "Index out of range" });
    return;
  }
  res.status(200).json({
    data: questionList[index],
  });
};

const updateQuestion = async (req: Request, res: Response) => {
  let questionId = req.params.questionId;
  let updateQuestion = req.body;
  let question = await Question.findOne({});
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }
  try {
    await Question.updateOne({ _id: question }, updateQuestion);
    res.status(200).json({ message: "Question updated" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteQuestion = async (req: Request, res: Response) => {
  let questionId = req.params.questionId;
  let question = await Question.deleteOne({ _id: questionId });
  if (question.deletedCount === 0) {
    res.status(400).json({ message: "Question not found" });
    return;
  }
  res.status(200).json({ message: "Question deleted" });
};
export {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
