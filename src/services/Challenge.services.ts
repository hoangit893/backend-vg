import Challenge from "../models/Challenge.model";
import Topic from "../models/Topic.model";

const getChallengeService = async () => {
  const challenges = await Challenge.find();
  return {
    status: 200,
    message: {
      challenges,
    },
  };
};

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
  img?: string;
  description?: string;
}) => {
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
    message: {
      message: "Challenge created ",
    },
  };
};

const getChallengeByTopicService = async (topicID: string) => {
  const topic = await Topic.findOne({ _id: topicID });
  if (!topic) {
    return {
      status: 404,
      message: {
        error: "Topic not found",
      },
    };
  }
  const challenges = await Challenge.find({ topicId: topicID }).populate(
    "topicId"
  );
  return {
    status: 200,

    challenges,
  };
};

export {
  createChallengeService,
  getChallengeByTopicService,
  getChallengeService,
};
