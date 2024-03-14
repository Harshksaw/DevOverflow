"use server";

import type {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";

import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { assignBadges } from "../utils";
import { connectToDatabase } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    console.log("newUser", newUser);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // get user question ids

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: Delete user answers, comments, etc

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({
      clerkId: userId,
    });
    console.log("useracton. ", userId)

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

// explain the params
    const {searchQuery, filter , page = 1, pageSize = 2} = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ]
    }

    let sortOptions = {};

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 };

        break;
      case 'old_users':
        sortOptions = { joinedAd: 1 }
      case 'top_contributors':
        sortOptions = { reputation: -1 }


      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    

      const totalUsers = await User.countDocuments(query);
      const isNext = totalUsers > skipAmount + User.length;
   


      return { users , isNext};



  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 2 } = params;

    const skipAmount = (page - 1) * pageSize;


    const query: FilterQuery<typeof Question> = searchQuery ? { title: { $regex: new RegExp(searchQuery, 'i') } } : {}


    let sortOptions = {};

    switch (filter) {

      case 'most_Recent':
        sortOptions = { createdAt: -1 }
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break;
      case 'most_voted':
        sortOptions = { upvotes: -1 }
        break;
      case 'most_viewed':
        sortOptions = { views: -1 }
        break;
      case 'Most Answered':
        sortOptions = { answers: -1 }
        break;


      default:
        break;
    }

  
    const user = await User.findOne({ clerkId }).populate({
    path: "saved",
    match: query,
    options: {
      sort: sortOptions,
      skip: skipAmount,
      limit: pageSize + 1,
    },
    populate: [
      { path: "tags", model: Tag, select: "_id name" },
      { path: "author", model: User, select: "_id clerkId name picture" },
    ],
  })
  .skip(skipAmount)
  .limit(pageSize)
 
  const isNext = user.saved.lenghth  > pageSize;
    const totalQuestions = await Question.countDocuments(query);




  if (!user) {
    throw new Error("User not found");
  }

  const savedQuestions = user.saved;

  return { questions: savedQuestions, isNext };
  
} catch (error) {
  console.log(error);
  throw error;
}
}


export async function getUserInfo(params: GetUserByIdParams) {


  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      throw new Error("User not found");
    }
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });


    const [questionUpvotes] = await Question.aggregate([  
      {$match : {author: user._id}},
      {$project : {
        _id : 0, upvotes :  {$size : "$upvotes"}
      }},
      {
        $group: {
          _id: null,
          totalUpvotes: {$sum : "$upvotes"}
        }
      }
    ])
    const [answerUpvotes] = await Answer.aggregate([  
      {$match : {author: user._id}},
      {$project : {
        _id : 0, upvotes :  {$size : "$upvotes"}
      }},
      {
        $group: {
          _id: null,
          totalUpvotes: {$sum : "$upvotes"}
        }
      }
    ])
    const [questionViews] = await Answer.aggregate([  
      {$match : {author: user._id}},
      {$project : {
        _id : 0, upvotes :  {$size : "$upvotes"}
      }},
      {
        $group: {
          _id: null,
          totalViews : {$sum : "$views"}
        }
      }
    ])
    const criteria = [
      {
        type: 'QUESTION_COUNT' as  BadgeCriteriaType, count: totalQuestions
      },
      {
        type: 'ANSWER_COUNT' as  BadgeCriteriaType, count: totalAnswers
      },
      {
        type: 'QUESTION_UPVOTES' as  BadgeCriteriaType, count: questionUpvotes?.totalUPvotes || 0
      },
      {
        type: 'ANSWER_UPVOTES' as  BadgeCriteriaType, count: answerUpvotes?.totalUpvotes || 0
      },
      {
        type: 'TOTAL_VIEWS' as  BadgeCriteriaType, count: questionViews?.totalViews || 0
      }
    ]

      const badgeCounts = assignBadges({criteria})
    
    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts
    }





  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const skipAmount = (page - 1) * pageSize;

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1 ,  createdAt : -1 , upvotes: -1 ,})
      .skip(skipAmount)
      .limit(pageSize)
      .populate([


        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ]);

      const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions , isNextQuestions};


  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const skipAmount = (page - 1) * pageSize;


    const userAnswer = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name picture')
      .skip(skipAmount)
      .limit(pageSize);



      const isNext = totalQuestions > skipAmount + userAnswer.length;



    return { totalQuestions, questions: userAnswer , isNext};


  } catch (error) {
    console.log(error);
    throw error;
  }
}