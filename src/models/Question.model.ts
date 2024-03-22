import { ref } from "joi";
import mongoose from "mongoose";
import Answer from "./Answer.model";
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ["single-choice", "multi-choice", "arrange"],
  },
  question: {
    type: String,
    required: true,
  },
  answerList: {
    type: [{ value: String, isCorrect: Boolean }],
    required: true,
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
