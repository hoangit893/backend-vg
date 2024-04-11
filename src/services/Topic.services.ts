import Topic from "../models/Topic.model";

//MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });

const getTopicsService = async (
  queries: object,
  skip: number,
  limit: number
) => {
  const total = await Topic.countDocuments(queries);
  const topics = await Topic.find(queries, {}, { skip: skip, limit: limit });
  console.log(topics);
  return {
    status: 200,
    message: {
      topics,
      total,
    },
  };
};

//create topic service
const createTopicService = async ({
  topicName,
  description,
  imageUrl,
}: {
  topicName: string;
  description?: string;
  imageUrl?: string;
}) => {
  const isExistTopic = await Topic.findOne({ topicName: topicName });
  if (isExistTopic) {
    return {
      status: 400,
      message: {
        error: "Topic already exists",
      },
    };
  }

  const newTopic = new Topic({
    topicName: topicName,
    description: description,
    imageUrl: imageUrl,
  });

  await newTopic.save();
  return {
    status: 200,
    message: {
      topic: newTopic,
    },
  };
};

export { createTopicService, getTopicsService };
