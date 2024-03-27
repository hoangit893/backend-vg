import { Request, Response } from "express";
import { createTopic, getTopics } from "../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();
import { auth } from "../middlewares/auth";
import { getChallengeByTopic } from "../controllers/Challenge.controller";
import { getChallengeByTopicService } from "../services/Challenge.services";

// topicRoute.get("/", auth, (req: Request, res: Response) => {
//   getTopics(req, res);
// });

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

topicRoute.get("/", auth, async (req: Request, res: Response) => {
  getTopics(req, res);
});

topicRoute.get(
  "/:topicId/challenges",
  auth,
  async (req: Request, res: Response) => {
    getChallengeByTopic(req, res);
  }
);
export default topicRoute;
