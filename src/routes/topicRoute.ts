import { Request, Response } from "express";
import { createTopic, getTopics } from "../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();
import { auth } from "../middlewares/auth";

topicRoute.get("/", (req: Request, res: Response) => {
  getTopics(req, res);
});

topicRoute.post("/create", auth, (req: Request, res: Response) => {
  createTopic(req, res);
});

export default topicRoute;
