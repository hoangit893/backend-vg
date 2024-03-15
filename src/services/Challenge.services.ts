import Challenge from "../models/Challenge.model";
import Topic from "../models/Topic.model";

const createChallengeService = async ({
  challengeName,
  level,
  topicName,
  point,
  img,
  description,
}: {
  challengeName: string;
  level: string;
  topicName: string;
  point: number;
  img: string;
  description?: string;
}) => {
  if (!challengeName || !level || !topicName) {
    return {
      status: 400,
      message: { error: "Challenge name, level and topic name are required" },
    };
  }

  const isExistChallenge = await Challenge.findOne({
    challengeName: challengeName,
  });

  if (isExistChallenge) {
    return {
      status: 400,
      message: {
        error: "Challenge already exists",
      },
    };
  }

  let topic = await Topic.findOne({ topicName: topicName });

  if (!topic) {
    return {
      status: 400,
      message: { error: "Topic not found" },
    };
  }

  try {
    const challenge = new Challenge({
      challengeName,
      level,
      topicId: topic.id,
      point,
      img,
      description,
    });

    await challenge.save();
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Error creating challenge",
    };
  }

  return {
    status: 200,
    message: "Challenge created !!",
  };
};

export { createChallengeService };
