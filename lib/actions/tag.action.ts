"use server";

import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";

import { connectToDatabase } from "@/lib/mongoose";

import type {
  GetAllTagsParams,
  GetQuestionByTagIdParams,
} from "./shared.types";
import { number } from "prop-types";

import { FilterQuery } from "mongoose";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 5} = params;

    const query: FilterQuery<typeof Tag> = {};
    
    const skipAmount = (page - 1) * pageSize;


    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, 'i') } }
      ]
    }
    let sortOptions = {};

    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 }
        break;
      case 'recent':
        sortOptions = { createdAt : -1 }

        break;
      case "name":
        sortOptions = { name: 1 }
        break;
      case "old":
        sortOptions = { createdAt: -1 }
      default:
        break;
    }

    const tags = await Tag.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);  
    const isNext = totalTags > skipAmount + tags.length;

    return { tags ,isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId , page= 1, pageSize= 5} = params;

    const skipAmount = (page - 1)* pageSize;

    const tag = await Tag.findOne({ _id: tagId }).populate({
      path: "questions",
      model: Question,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }
    const isNext = tag.questions.length > pageSize;
    const questions = tag.questions;




    return { tagTitle: tag.name, questions , isNext};

  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function getPopularTags() {

  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 }

    ])

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }

}