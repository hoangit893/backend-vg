import mongoose from "mongoose";
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ["single-choice", "multi-choice", "rerange"],
  },
  question: {
    type: String,
  },
  challengeSchema: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
