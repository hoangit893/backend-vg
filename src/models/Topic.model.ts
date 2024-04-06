import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;
import MongooseDelete, {
  SoftDeleteModel,
  SoftDeleteDocument,
} from "mongoose-delete";

interface Topic extends SoftDeleteDocument {
  topicName: string;
  description: string;
  imageUrl: string;
}

const topicSchema = new Schema({
  topicName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

topicSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Topic = model<SoftDeleteDocument, SoftDeleteModel<Topic>>(
  "Topic",
  topicSchema
);
export default Topic;

/**
 *  10 nguoi choi
 *
 */
