import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import dayjs from "dayjs";

const jwt = require("jsonwebtoken");
const { config } = require("../configs/config");

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization !== undefined) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token, config.jwt.secret);
      req.body.username = decoded.username;
      req.headers.username = decoded.username;
      req.headers.role = decoded.role;
      const user = await User.findOne({ username: decoded.username });
      if (!user) {
        console.log("Unauthorized - 2");
        res.status(401).send("Unauthorized");
        return;
      }
      user.lastVisit = dayjs().unix();
      await user.save();
      next();
    } else {
      console.log("Unauthorized - 1");
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
};
