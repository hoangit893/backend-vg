import { Request, Response } from "express";
import { createChallengeService } from "../services/Challenge.services";

const createChallenge = async (req: Request, res: Response) => {
  const challenge: {
    challengeName: string;
    level: string;
    point: number;
    topicName: string;
    img: string;
    description?: string;
  } = req.body;
  try {
    if (challenge.point !== undefined) {
      res.status(400).json({ message: "Point is not required" });
    }
    if (challenge.level === "easy") {
      challenge.point = 100;
    } else if (challenge.level === "medium") {
      challenge.point = 200;
    } else if (challenge.level === "hard") {
      challenge.point = 300;
    }

    const response = await createChallengeService(challenge);
    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createChallenge };
