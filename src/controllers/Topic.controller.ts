import { Request, Response } from "express";
import {
  createTopicService,
  getTopicsService,
} from "../services/Topic.services";

const createTopic = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }
  const topic: { topicName: string; description?: string } = req.body;
  try {
    // Your logic here
    if (!topic.topicName) {
      res.status(400).json({ message: "Name is required" });
      return;
    }
    const response = await createTopicService(topic);
    res.status(response.status).json(response.message);
    // Sending the response
  } catch (error) {
    // Handling errors
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await getTopicsService();
    res.status(topics.status).json(topics.message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createTopic, getTopics };
