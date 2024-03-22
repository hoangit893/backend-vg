import mongoose from "mongoose";
import { describe } from "node:test";
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
  challengeName: {
    type: String,
  },
  level: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  description: {
    type: String,
  },
  point: {
    type: Number,
  },
  image: {
    type: String,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
