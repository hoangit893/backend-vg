import express, { Request, Response } from "express";
import { auth } from "../../middlewares/auth";
import {
  createChallenge,
  getChallenge,
  getChallengeList,
  updateChallenge,
  deleteChallenge,
} from "../../controllers/Challenge.controller";
import { checkAnswerService } from "../../services/Answer.services";
import { getRankListService } from "../../services/User.services";

const challengeRoute = express.Router();

challengeRoute.get("/", auth, (req: Request, res: Response) => {
  if (req.headers.role !== "admin" && req.headers.role !== "user") {
    res.status(401).send("Unauthorized");
    return;
  }
  getChallengeList(req, res);
});

challengeRoute.post("/create", auth, (req: Request, res: Response) => {
  if (!req.headers.role) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.headers.role !== "admin") {
    res.status(401).send("Forbidden");
    return;
  }
  createChallenge(req, res);
});

challengeRoute.get(
  "/:challengeId/detail",
  auth,
  (req: Request, res: Response) => {
    getChallenge(req, res);
  }
);

challengeRoute.put(
  "/update/:challengeId",
  auth,
  (req: Request, res: Response) => {
    if (req.headers.role !== "admin") {
      res.status(401).send("Forbidden");
      return;
    }
    updateChallenge(req, res);
  }
);

challengeRoute.delete(
  "/delete/:challengeId",
  auth,
  (req: Request, res: Response) => {
    if (req.headers.role !== "admin") {
      res.status(401).send("Forbidden");
      return;
    }
    deleteChallenge(req, res);
  }
);

challengeRoute.post("/check-answers", auth, (req: Request, res: Response) => {
  checkAnswerService(req, res);
});

challengeRoute.get("/rank", (req: Request, res: Response) => {
  getRankListService(req, res);
});
challengeRoute.get("/statistics", (req: Request, res: Response) => {});
export default challengeRoute;
