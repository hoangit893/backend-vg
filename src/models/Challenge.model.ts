import mongoose, { ObjectId, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteModel,
  SoftDeleteDocument,
} from "mongoose-delete";

interface Challenge extends SoftDeleteDocument {
  challengeName: string;
  level: string;
  description: string;
  point: number;
  imageUrl: string;
  topicId: string;
  userList: [any];
}

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
  imageUrl: {
    type: String,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
  userList: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      point: {
        type: Number,
      },
    },
  ],
});

challengeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Challenge = mongoose.model<
  SoftDeleteDocument,
  SoftDeleteModel<Challenge>
>("Challenge", challengeSchema);

export default Challenge;
