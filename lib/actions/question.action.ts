"use server";

import type {
  CreateQuestionParams,
  DeleteAnswerParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";

import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";
import { Inter } from "next/font/google";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // create new question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // todo: create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action : 'ask_question',
      question: question._id,
      tags: tagDocuments
    })

    await User.findByIdAndUpdate(author , {$inc: {reputation : 5}})
    

    // todo: increment author's reputation by +S for creating a question

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const {searchQuery, filter , page = 1, pageSize = 10} = params;


    //calculate the number of posts to skip base on the page number and page size
   const skipAmount = (page - 1) * pageSize;

    const  query : FilterQuery<typeof Question> = {};

    if(searchQuery){
      query.$or=[
        {title: { $regex: new RegExp(`^${searchQuery}$`, "i") }},
        {content: { $regex: new RegExp(`^${searchQuery}$`, "i") }},
      ]
    }


    let sortOptions = {};
    switch(filter){
      case "newest": 
        sortOptions  = {createdAt : -1}
      break;
      case "frequent":
        sortOptions = {views : -1}

      break
      case "unanswered":
        query.answers = { $size : 0}
      break

      default:
        break
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)


    const totalQuestion = await Question.countDocuments(query);
    const isNext = totalQuestion > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    if (userId !== question.author.toString()) {
      // increment user's reputation by +S for upvoting/revoking an upvote to the question (S = 1)
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      });

      // increment author's reputation by +S for upvoting/revoking an upvote to the question (S = 10)
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    //Increment author's repuatation by +1 /-1 for upvoting /revoking  and upvote to the question

    await User.findByIdAndUpdate({
      $inc : {reputation : hasupVoted ? -1 : 1}
    })

    //Increment author repuration by +10 /10  for reciving an upvote /downvote question
    await User.findById(question.author, {
      $inc: {reputation : hasupVoted ? -10 : 10}
    })

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    if (userId !== question.author.toString()) {
      // decrement user's reputation by +S for downvoting/revoking an downvote to the question (S = 1)
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? 2 : -2 },
      });

      // decrement author's reputation by +S for downvoting/revoking an downvote to the question (S = 10)
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasdownVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}



export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();


    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });

    //delete all answers associated with it

    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });

    await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } });

    revalidatePath(path);


  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();


    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ question: answerId });
    await Interaction.updateMany({ _id: answer.question }, { $pull: { answers: answerId } });

    await Interaction.updateMany({ answer: answerId });


    revalidatePath(path);


  }
  catch (error) {
    console.log(error);
    throw error;
  }
}


export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
    .sort({views: -1, upvotes : -1})
    .limit(5)
    

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}