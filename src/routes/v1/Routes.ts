import answerRoute from "./answerRoute";
import challangeRoute from "./challangeRoute";
import questionRoute from "./questionRoute";
import userRoute from "./userRoute";
import topicRoute from "./topicRoute";
import express from "express";

const apiV1 = express.Router();

apiV1.use("/user", userRoute);
apiV1.use("/topic", topicRoute);
apiV1.use("/challange", challangeRoute);
apiV1.use("/question", questionRoute);
apiV1.use("/answer", answerRoute);

export default apiV1;
// Path: src/routes/v1/answerRoute.ts
