import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

interface UserPlayRecord {
  userId: string;
  challengeId: string;
  point: number;
  date: Date;
  //   answerList: Array<{
  //     questionId: string;
  //     answer: string;
  //     _id: mongoose.Schema.Types.ObjectId;
  //   }>;
}

const userPlayRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
  point: {
    type: Number,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

userPlayRecordSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const UserPlayRecord = mongoose.model("UserPlayRecord", userPlayRecordSchema);
export default UserPlayRecord;
