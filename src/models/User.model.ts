import { number } from "joi";
import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  avatarImg: {
    type: String,
    default: "https://imgur.com/WxNkK7J",
  },
  bio: {
    type: String,
    default: "This is a bio",
  },
  rank: {
    type: String,
    default: "bronze",
  },
  totalPoint: {
    type: Number,
    default: 0,
  },
  challengeList: [
    {
      challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
      },
      challengePoint: {
        type: Number,
      },
      point: {
        type: Number,
        default: 0,
      },
      isDone: {
        type: Boolean,
        default: false,
      },
      questionList: [
        {
          question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
          },
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

userSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const User = mongoose.model("User", userSchema);

export default User;
