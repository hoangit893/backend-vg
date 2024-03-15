import { Request, Response } from "express";

// Sample controller function
export const getAnswer = (req: Request, res: Response) => {
  try {
    // Your logic here
    const answer = "This is the answer to your question.";

    // Sending the response
    res.status(200).json({ answer });
  } catch (error) {
    // Handling errors
    res.status(500).json({ error: "Internal server error" });
  }
};
