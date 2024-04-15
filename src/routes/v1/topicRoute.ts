import { Request, Response } from "express";
import {
  createTopic,
  getAllTopics,
  getTopics,
} from "../../controllers/Topic.controller";
import exp from "constants";
const topicRoute = require("express").Router();
import { auth } from "../../middlewares/auth";
import { updateTopic, deleteTopic } from "../../controllers/Topic.controller";

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

topicRoute.get("/all", auth, async (req: Request, res: Response) => {
  getAllTopics(req, res);
});

topicRoute.put(
  "/update/:topicId",
  auth,
  async (req: Request, res: Response) => {
    updateTopic(req, res);
  }
);

topicRoute.delete(
  "/delete/:topicId",
  auth,
  async (req: Request, res: Response) => {
    deleteTopic(req, res);
  }
);
export default topicRoute;
