import mongoose from "mongoose";
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  topicName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;

/**
 *  10 nguoi choi
 *
 */
