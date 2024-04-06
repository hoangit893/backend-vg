import e from "express";
import mongoose, { Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteModel,
  SoftDeleteDocument,
} from "mongoose-delete";

interface Question extends SoftDeleteDocument {
  type: string;
  question: string | Array<string>;
  answerList: Array<{
    _id: Schema.Types.ObjectId;
    value: string;
    isCorrect: boolean;
    index: number;
  }>;
  challengeId: string;
}

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ["single-choice", "multi-choice", "arrange"],
  },
  question: {
    type: String || Array,
    required: true,
  },
  answerList: {
    type: [
      {
        value: String,
        isCorrect: {
          type: Boolean,
          default: false,
          required: true,
        },
        index: Number,
      },
    ],
    required: true,
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
  },
});
questionSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

questionSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Question = mongoose.model<SoftDeleteDocument, SoftDeleteModel<Question>>(
  "Question",
  questionSchema
);
export default Question;
