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
  questionSchema: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
