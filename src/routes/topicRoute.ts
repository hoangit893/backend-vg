import { Request, Response } from "express";
import { createTopic, getTopics } from "../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();
import { authManager } from "../middlewares/authManager";

topicRoute.get("/", (req: Request, res: Response) => {
  getTopics(req, res);
});

topicRoute.post("/create", authManager, (req: Request, res: Response) => {
  createTopic(req, res);
});

export default topicRoute;
