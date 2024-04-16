#!/usr/bin/env ts-node

import express, { NextFunction, Request, Response } from "express";
import { config } from "./configs/config";
import { connectDB } from "./configs/db";
import cors from "cors";
import https from "https";
import Logging from "./helpers/Logging";
const jwt = require("jsonwebtoken");
const hsts = require("hsts");

//Routes
import apiV1 from "./routes/v1/Routes";

const app = express();
app.use(
  hsts({
    maxAge: 31536000, // Must be at least 1 year to be approved
    includeSubDomains: true, // Must be enabled to be approved
    preload: true,
  })
);
// ** MIDDLEWARES **
//* CORS
// app.use(cors());

import fs from "fs";

// Your existing app configuration...

const privateKey = fs.readFileSync("./cert/server.key", "utf8");
const certificate = fs.readFileSync("./cert/server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

var whitelist = [
  "https://www.tiengvietlade.click",
  "http://www.tiengvietlade.click",
  "http://20.198.217.162:8081",
  "http://tiengvietlade.click",
  "https://tiengvietlade.click",
];
var corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
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

app.use(cors(corsOptionsDelegate));

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

//* API
app.use("/api/v1/", apiV1);

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

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("not found");
  res.status(404).json({
    message: error.message,
  });
});

connectDB().then((res) => {
  https.createServer(credentials, app).listen(443, () => {
    Logging.info(`Server is running on port 443`);
  });
  // app.listen(config.server.port, () => {
  //   Logging.info(`Server is running on port ${config.server.port}`);
  // });
  console.log(res);
});
