import { ref } from "joi";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
