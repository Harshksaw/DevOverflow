"use server";

import type {
  AnswerVoteParams,
  CreateAnswerParams,
  EditAnswerParams,
  GetAnswersParams,
} from "./shared.types";

import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
      path,
    });

    // add the answer to the question's answers array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // todo: create an interaction record for the user's create_answer action

    await Interaction.create({
      user: author
      , action : "answer",
      question ,
      answer: newAnswer._id,
      tags: questionObject.tags
    })
    // todo: author's reputation by +S for creating a answer

    await User.findByIdAndUpdate(author, { $inc: {reputation : 10}})

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editAnswer(params: EditAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, content, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    answer.content = content;

    await answer.save();

    redirect(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId ,sortBy ,page = 1,pageSize = 5} = params;

    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 }
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes : 1 }
        break;
      case 'recent':
        sortOptions = {createdAt : -1}
        break;
      case 'old':
        sortOptions = {createdAt : 1}
        break;

        
    
      default:
        break;
    }

    

    const answers = await Answer.find({ question: questionId }).populate(
      "author",
      "_id clerkId name picture"
    ).sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skipAmount + answers.length;


    return { answers , isNext};
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (userId !== answer.author.toString()) {
      // increment user's reputation by +S for upvoting/revoking an upvote to the answer (S = 2)
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      });

      // increment author's reputation by +S for upvoting/revoking an upvote to the answer (S = 10)
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Question.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (userId !== answer.author.toString()) {
      // decrement author's reputation by +S for downvoting/revoking an downvote to the answer (S = 2)
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? -2 : 2 },
      });

      // decrement author's reputation by +S for downvoting/revoking an downvote to the answer (S = 10)
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
