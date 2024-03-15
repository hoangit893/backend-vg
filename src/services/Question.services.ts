import { Request, Response } from "express";
import Question from "../models/Question.model";
import Challenge from "../models/Challenge.model";

const createQuestionService = async (req: Request, res: Response) => {
  const { type, question, challengeName } = req.body;

  if (!type || !question || !challengeName) {
    res.status(400).send("Missing fields");
    return;
  }

  let challenge = await Challenge.findOne({ nameChallenge: challengeName });

  if (!challenge) {
    res.status(400).send("Challenge not found");
    return;
  }

  try {
    const newQuestion = new Question({
      type,
      question,
      challengeSchema: challenge.id,
    });

    await newQuestion.save();
  } catch (error) {
    console.log(error);
    res.status(400).send("Error creating question");
  }

  res.status(200).send("Question created !!");
};

export { createQuestionService };
