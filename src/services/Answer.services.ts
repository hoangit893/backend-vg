import e, { Request, Response } from "express";
import Question from "../models/Question.model";
import User from "../models/User.model";
import Challenge from "../models/Challenge.model";

const checkAnswerService = async (req: Request, res: Response) => {
  const challengeId = req.body.challengeId;
  const answerList = req.body.answerList;
  const username = req.headers.username?.toString();
  let correctAnswer = 0;
  const checkAnswer = async (questionId: string, userAnswer: any) => {
    const question = await Question.findById(questionId);
    if (!question) {
      // res.status(400).send("Question not found");
      return;
    }
    switch (question.type) {
      case "single-choice":
        const correctAnswer = question.answerList.find(
          (answer: any) => answer.isCorrect === true
        );
        return correctAnswer?._id.toString() === userAnswer[0];
      case "multi-choice":
        return question.answerList.every((answer: any) => {
          return (
            answer.isCorrect === true &&
            userAnswer.includes(answer._id.toString())
          );
        });
      case "arrange":
        return question.answerList.every((answer: any, index: number) => {
          return answer.value === userAnswer[index];
        });
      default:
        // res.status(400).send("Invalid question type");
        return;
    }
  };

  const user = await User.findOne({ username });
  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    res.status(400).send("Challenge not found");
    return;
  }

  const numberOfQuestion = await Question.countDocuments({
    challengeId: challengeId,
  });

  let point = 0;
  const pointFromQuestion = challenge.point / numberOfQuestion;

  for (let i = 0; i < answerList.length; i++) {
    if (await checkAnswer(answerList[i].questionId, answerList[i].answers)) {
      correctAnswer++;
      point += pointFromQuestion;
    }
  }

  user.challengeList.push({
    challengeId: challengeId,
    point,
  });

  challenge?.userList.push({ userId: user._id, point });
  // const question = await Question.findOne({ _id: questionId });

  // if (!question) {
  //   res.status(400).send("Question not found");
  //   return;
  // }

  // let answer = question.answerList;
  // const questionType = question.type;
  // switch (questionType) {
  //   case "single-choice": {
  //     if (userAnswer.length !== 1) {
  //       res.status(400).send("Just 1 selection is allowed");
  //       return;
  //     }

  //     let correctAnswer = answer
  //       .find((ans) => ans.isCorrect === true)
  //       ?._id?.toString();

  //     if (correctAnswer && correctAnswer === userAnswer[0]) {
  //       isCorrect = true;
  //     }
  //     break;
  //   }
  //   case "multi-choice": {
  //     if (userAnswer.length <= 1) {
  //       res.status(400).send("No selection found");
  //       return;
  //     }
  //     let correctAnswers = answer.filter((ans) => ans.isCorrect === true);
  //     if (!correctAnswers) {
  //       res.status(400).send("No correct answer found");
  //       return;
  //     }

  //     let correctAnswersId = correctAnswers.map((ans) => {
  //       if (ans._id) return ans._id.toString();
  //     });

  //     if (
  //       correctAnswersId.length === userAnswer.length &&
  //       correctAnswersId.every((val: any) => userAnswer.includes(val))
  //     ) {
  //       isCorrect = true;
  //     }

  //     break;
  //   }
  //   case "arrange":
  //     // console.log(answer);
  //     // console.log(userAnswer);
  //     userAnswer.split(" ").forEach((word: string, index: number) => {
  //       if (answer[index].value !== word) {
  //         console.log(answer[index].value, word);
  //         isCorrect = false;
  //         return;
  //       }
  //       isCorrect = true;
  //     });
  //     break;
  //   default:
  //     res.status(400).send("Invalid question type");
  //     return;
  // }

  user.save();
  challenge.save();
  res.status(200).json({
    message: "Answer checked",
    totalQuestion: numberOfQuestion,
    correctAnswer,
    point,
  });
};

const addNewChallengeService = async (
  username: string,
  challengeId: string
) => {
  let user = await User.findOne({ username: username });

  if (!user) {
    return false;
  }

  let challengeList = user.challengeList;
  let currentChallenge = challengeList.find((challenge) => {
    return challenge.challengeId?.toString() == challengeId;
  });

  if (!currentChallenge) {
    challengeList.push({
      challengeId: challengeId,
      questionList: [],
      point: 0,
    });
  } else {
    return false;
  }

  await user.save();
  return true;
};

const checkAnswerServiceV2 = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  const userAnswer = req.body.userAnswer;
  const username = req.headers.username?.toString();

  console.log(username, questionId, userAnswer);
  const checkAnswer = (question: any, userAnswer: any) => {
    switch (question.type) {
      case "single-choice":
        const correctAnswer = question.answerList.find(
          (answer: any) => answer.isCorrect === true
        );
        return correctAnswer._id.toString() === userAnswer[0];
      case "multi-choice":
        return question.answerList.every((answer: any) => {
          return (
            answer.isCorrect === true &&
            userAnswer.includes(answer._id.toString())
          );
        });
      case "arrange":
        return question.answerList.every((answer: any, index: number) => {
          return answer.value === userAnswer[index];
        });
      default:
        res.status(400).send("Invalid question type");
        return;
    }
  };

  const calculatePoint = async (challenge: any) => {
    let currentPoint: number = 0;
    let length = await Question.countDocuments({
      challengeId: challenge.challengeId._id,
    });
    let scoreFromQuestion: number = challenge.challengeId.point / length;
    challenge.questionList.forEach(
      (question: { question: any; isCorrect: any }) => {
        if (question.isCorrect) {
          currentPoint = currentPoint + scoreFromQuestion;
        }
      }
    );
    console.log(currentPoint);
    return currentPoint;
  };

  const calculateTotalPoint = async (user: any) => {
    let totalPoint = 0;
    user.challengeList.forEach((challenge: any) => {
      totalPoint += challenge.point;
    });
    return totalPoint;
  };

  const isFinished = async (challenge: any) => {
    let length = await Question.countDocuments({
      challengeId: challenge.challengeId._id,
    });
    if (challenge.questionList.length === length) {
      return true;
    } else {
      return false;
    }
  };

  if (!username) {
    res.status(400).send("Login required");
    return;
  }

  if (!questionId) {
    res.status(400).send("QuestionId required");
    return;
  }
  const question = await Question.findOne({
    _id: questionId,
  });

  if (!question) {
    res.status(400).send("Question not found");
    return;
  }

  const challengeId = question.challengeId;
  await addNewChallengeService(username, challengeId);

  const user = await User.findOne({ username: username }).populate(
    "challengeList.challengeId"
  );
  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  let challengeList = user.challengeList;

  console.log(challengeList);

  const currentChallenge = challengeList.find(
    (challenge: any) => challenge.challengeId._id?.toString() == challengeId
  );
  if (!currentChallenge) {
    console.log(currentChallenge);
    res.status(500).send("Internal error");
    return;
  }
  // const getPoint = async (challengeId: string) => {
  //   const challenge = await Challenge.findOne({ _id: challengeId });
  //   if (!challenge) {
  //     res.status(400).send("Challenge not found");
  //     return;
  //   }
  //   return challenge.point.valueOf();
  // };

  if (
    currentChallenge.questionList.find(
      (question: any) => question.question.toString() === questionId
    )
  ) {
    res.status(400).send({
      message: "Question already answered",
    });
    return;
  }

  currentChallenge.questionList.push({
    question: questionId,
    isCorrect: checkAnswer(question, userAnswer),
  });

  console.log(currentChallenge);

  currentChallenge.point = await calculatePoint(currentChallenge);

  if (await isFinished(currentChallenge)) {
    currentChallenge.isDone = true;
    user.totalPoint = await calculateTotalPoint(user);
  }

  user.totalPoint = challengeList.reduce((acc, challenge) => {
    return acc + challenge.point;
  }, 0);
  user.challengeList = challengeList;
  await user.save();
  res.status(200).json({ challenge: currentChallenge });
};

export { checkAnswerService, checkAnswerServiceV2 };
