import express, { NextFunction, Request, Response } from "express";
import { config } from "./configs/config";
import { connectDB } from "./configs/db";
const logger = require("morgan");
import cors from "cors";
import http from "http";
import Logging from "./library/Logging";
const jwt = require("jsonwebtoken");

//Routes
import {
  userRoute,
  questionRoute,
  answerRoute,
  challangeRoute,
  topicRoute,
} from "./routes/Routes";

const app = express();

// ** MIDDLEWARES **
//* CORS
app.use(cors());

//* JSON
app.use(express.json());

app.use((req, res, next) => {
  // log request
  Logging.info(
    `Request URL: ${req.originalUrl} | Request Type: ${
      req.method
    } | Request IP: ${req.ip} | Request Time: ${new Date().toLocaleString()}`
  );

  Logging.warning(
    `Response Status: [${
      res.statusCode
    }]  Response Time: [${new Date().toLocaleString()}]`
  );
  next();
});

app.use("/auth", async (req: Request, res: Response) => {
  try {
    if (req.headers.authorization !== undefined) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token, config.jwt.secret);

      req.headers.username = decoded.username;
      res.status(200).send("Authorized");
    } else {
      res.status(401).send("OK");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
});

//* LOGGING

//* ERROR HANDLER

// **************** //

// ** ROUTES **

//* PING
app.get("/ping", (req: Request, res: Response) => {
  res.send("Hello World");
});

//* USER
app.use("/user", userRoute);

//* AUTH
// app.use(async (req: Request, res: Response) => {
//   try {
//     if (req.headers.authorization !== undefined) {
//       const token = req.headers.authorization.split(" ")[1];
//       const decoded = await jwt.verify(token, config.jwt.secret);

//       req.headers.username = decoded.username;
//       res.status(200).json({
//         message: "Authorized",
//       });
//     } else {
//       res.status(401).json({
//         message: "Unauthorized",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       message: "Unauthorized",
//     });
//   }
// });

//*TOPIC
app.use("/topic", topicRoute);

//* CHALLENGE
app.use("/challenge", challangeRoute);

//* QUESTION
app.use("/question", questionRoute);

//* ANSWER
app.use("/answer", answerRoute);
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("not found");
  res.status(404).json({
    message: error.message,
  });
});

connectDB().then((res) => {
  http.createServer(app).listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}`);
  });
  // app.listen(config.server.port, () => {
  //   Logging.info(`Server is running on port ${config.server.port}`);
  // });
  console.log(res);
});
