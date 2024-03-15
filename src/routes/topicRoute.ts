import { Request, Response } from "express";
import { createTopic, getTopics } from "../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();

topicRoute.get("/", (req: Request, res: Response) => {
  getTopics(req, res);
});
topicRoute.post("/create", (req: Request, res: Response) => {
  createTopic(req, res);
});

export default topicRoute;
