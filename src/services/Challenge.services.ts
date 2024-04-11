import Challenge from "../models/Challenge.model";
import Question from "../models/Question.model";
import Topic from "../models/Topic.model";

const getChallengeService = async (challengeId: string) => {
  const challenge = await Challenge.findOne({
    _id: challengeId,
  }).populate("topicId");

  if (!challenge) {
    return {
      status: 404,
      message: {
        error: "Challenge not found",
      },
    };
  } else {
    return {
      status: 200,
      message: {
        challenge,
      },
    };
  }
};

const getChallengeListService = async (queries: any) => {
  let page = queries.page ? Number(queries.page) : 1;
  let pageSize = queries.pageSize ? Number(queries.pageSize) : 10;
  const query: any = {};
  query.topicId = queries.topicId ? queries.topicId : { $ne: null };
  query.level = queries.level ? queries.level : { $ne: null };
  query.challengeName = queries.challengeName
    ? { $regex: queries.challengeName, $options: "i" }
    : { $ne: null };

  console.log(query);
  const total = await Challenge.countDocuments({ ...query });
  let challengeList = await Challenge.find(
    {
      ...query,
    },
    null,
    {
      skip: (page - 1) * pageSize,
      limit: pageSize,
    }
  ).populate("topicId");

  challengeList.filter((challenge) => {
    return challenge.topicId == null ? false : true;
  });

  return {
    status: 200,
    message: {
      challengeList,
      total: total,
    },
  };
};

const createChallengeService = async ({
  challengeName,
  level,
  topicId,
  point,
  imageUrl,
  description,
}: {
  challengeName: string;
  level: string;
  topicId: string;
  point: number;
  imageUrl?: string;
  description?: string;
}) => {
  const isExistChallenge = await Challenge.find({
    challengeName: challengeName,
  });

  console.log(isExistChallenge);

  if (isExistChallenge.length > 0) {
    return {
      status: 400,
      message: {
        error: "Challenge already exists",
      },
    };
  }

  let topic = await Topic.findOne({
    _id: topicId,
  });

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
      imageUrl,
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

const updateChallengeService = async (
  challengeId: string,
  updateData: {
    challengeName?: string;
    level?: string;
    topicName?: string;
    point?: number;
    imageUrl?: string;
    description?: string;
  }
) => {
  const challenge = await Challenge.findOne({ _id: challengeId });
  if (!challenge) {
    return {
      status: 404,
      message: "Challenge not found",
    };
  }
  const isDuplicateName = await Challenge.findOne({
    challengeName: updateData.challengeName,
  });

  if (isDuplicateName && isDuplicateName._id.toString() !== challengeId) {
    return {
      status: 400,
      message: "Challenge name already exists",
    };
  }

  let result = await Challenge.updateOne({ _id: challengeId }, updateData);
  if (result.matchedCount === 0) {
    return {
      status: 400,
      message: "Error updating challenge",
    };
  } else {
    return {
      status: 200,
      message: "Challenge updated",
    };
  }
};

const deleteChallengeService = async (challengeId: string) => {
  try {
    await Challenge.deleteById(challengeId);
    await Question.delete({ challengeId: challengeId });
    return {
      status: 200,
      message: "Challenge deleted",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Error deleting challenge",
    };
  }
};

export {
  createChallengeService,
  getChallengeService,
  getChallengeListService,
  updateChallengeService,
  deleteChallengeService,
};
