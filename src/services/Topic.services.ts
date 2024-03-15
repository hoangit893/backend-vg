import Topic from "../models/Topic.model";

const getTopicsService = async () => {
  const topics = await Topic.find();
  return {
    status: 200,
    message: {
      topics,
    },
  };
};

//create topic service
const createTopicService = async ({
  topicName,
  description,
}: {
  topicName: string;
  description?: string;
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
