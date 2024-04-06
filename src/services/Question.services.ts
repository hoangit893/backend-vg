import Question from "../models/Question.model";

const createQuestionService = async (
  type: string,
  question: string,
  challengeId: any,
  answerList: any
) => {
  if (type === "arrange") {
    let wordList = question.split(" ");
    answerList = wordList.map((word) => {
      return { value: word, index: wordList.indexOf(word) };
    });

    question = question
      .split(" ")
      .sort(() => Math.random() - 0.5)
      .join(" ");

    console.log(question);
    console.log(answerList);

    try {
      const newQuestion = new Question({
        type,
        question,
        challengeId,
        answerList,
      });
      newQuestion.save();
      return {
        status: 200,
        message: {
          message: "Question created",
          data: newQuestion,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: {
          error: error.message,
        },
      };
    }
  }

  console.log(answerList);

  for (let i = 0; i < answerList.length; i++) {
    if (answerList[i].isCorrect) {
      break;
    }
    if (i === answerList.length - 1) {
      return {
        status: 400,
        message: { message: "No correct answer found" },
      };
    }
  }

  try {
    const newQuestion = new Question({
      type,
      question,
      challengeId,
      answerList,
    });
    newQuestion.save();
    return {
      status: 200,
      message: {
        message: "Question created",
        data: newQuestion,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      message: { message: error.message },
    };
  }
};

export { createQuestionService };
