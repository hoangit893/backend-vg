import { Request, Response } from "express";
import {
  createChallengeService,
  getChallengeByTopicService,
  getChallengeService,
} from "../services/Challenge.services";

const getChallenge = async (req: Request, res: Response) => {
  const challengeId = req.params.challengeId;

  try {
    const response = await getChallengeService(challengeId);
    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createChallenge = async (req: Request, res: Response) => {
  const { challengeName, level, topicName, img, description } = req.body;
  let error = [];
  if (!challengeName) {
    error.push("Challenge name is required");
  }
  if (!level) {
    error.push("Level is required");
  }
  if (!topicName) {
    error.push("Topic name is required");
  }
  if (error.length > 0) {
    res.status(400).json({ message: error });
    return;
  }

  let point;
  switch (level) {
    case "easy":
      point = 100;
      break;
    case "medium":
      point = 200;
      break;
    case "hard":
      point = 300;
      break;
    default:
      res.status(400).json({ message: "Invalid level" });
      return;
  }

  const response = await createChallengeService({
    challengeName,
    level,
    topicName,
    point,
    img,
    description,
  });
  res.status(response.status).json(response.message);
};

const getChallengeByTopic = async (req: Request, res: Response) => {
  if (req.headers.role !== "user" && req.headers.role !== "admin") {
    res.status(401).send("Unauthorized");
    return;
  }
  const topicId = req.params.topicId;
  if (!topicId || topicId.length !== 24) {
    res.status(400).json({ message: "Invalid Topic ID" });
    return;
  }
  const response = await getChallengeByTopicService(topicId);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getChallenge, createChallenge, getChallengeByTopic };
