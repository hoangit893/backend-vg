import { Request, Response } from "express";
import { createTopic, getTopics } from "../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();
import { auth } from "../middlewares/auth";
import { getChallengeByTopic } from "../controllers/Challenge.controller";
import { getChallengeByTopicService } from "../services/Challenge.services";

topicRoute.get("/", auth, (req: Request, res: Response) => {
  4;
  getTopics(req, res);
});

topicRoute.post("/create", auth, (req: Request, res: Response) => {
  if (!req.headers.role) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.headers.role !== "admin") {
    res.status(401).send("Forbidden");
    return;
  }

  createTopic(req, res);
});

topicRoute.get("/:topicID", auth, async (req: Request, res: Response) => {
  const topicID = req.params.topicID;
  if (!topicID || topicID.length !== 24) {
    res.status(400).json({ message: "Invalid Topic ID" });
    return;
  }
  const response = await getChallengeByTopicService(topicID);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default topicRoute;
