'use server'

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

import Question from "@/database/question.model";
import User from "@/database/user.models";
import { connectToDatabase } from "../moongoose"
import page from '../../app/(root)/community/page';
import { revalidatePath } from "next/cache";
import { ToggleSaveQuestionParams } from './shared.types';
import Tag from "@/database/tag.model";

export async function getUserById(params: { userId: string }) {
    try {
      connectToDatabase();
  
      const { userId } = params;
  
      const user = await User.findOne({
        clerkId: userId,
      });
  
      return user;

    } catch (error) {
        console.log(error, " -->in user.action.ts");
        
    }
}

export async function createUser(userData :CreateUserParams) {
  try {
    connectToDatabase()
      
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error
  }
  
}
export async function updateUser(userData :UpdateUserParams) {
  try {
    connectToDatabase();
      
    const {clerkId , updateData, path} = userData;
    await User.findOneAndUpdate({clerkId: clerkId}, updateData, {new: true});


    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error
  }
  
}
export async function deleteUser(params :DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Delete User Questions
    // await Question.deleteMany({ author: user._id });

    // @todo -> delete user answers, comments, etc

    // const deletedUser = await User.findByIdAndDelete(user._id);

    // return deletedUser;
  } catch (error) {
    console.log(error);
    throw error
  }
  
}

export async function getAllUsers(params :GetAllUsersParams){
  try {
    connectToDatabase();
    // const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const users = await User.find({}).sort({createdAt : -1})



  } catch (error) {
    console.log(error);
    throw Error;
    
  }
}

export async function ToggleSaveQuestion(params : ToggleSaveQuestionParams){
  try {
    connectToDatabase();


    const {userId, questonId , path} = params;
    const user = await User.findById(userId);
    if(!user){
      throw new Error("User not found");
      }
      const isQuestionSaved = user.saved.includes(questionId);

      if(isQuestionSaved){
        await User.findByIdAndUpdate(userId ,
          {$pull : {saved : questionId }},
          {new : true}
          )
      }
      else{
        await User.findByIdAndUpdate(
          userId, 
          {$addToSet : {saved: questionId}},
          {new : true}
        )
      }

      revalidatePath(path)


  } catch (error) {
    console.log(error);
    throw error;
    
  }
}

export async function getSavedQuestions(params: GetSavedQuestionParams){

  try {
      connectToDatabase();
      const { clerkId, page = 1, pageSize = 20, filter, searchQuery} = params;
      const query = FilterQuery<typeof Question> = searchQuery

      const user = await User.findOne({clerkId}).populate({
        path: 'saved',
        match: query,
        options: {
          sort: {createdAt: -1},
        },
        populate: [
          {path: 'tags', model :Tag , select: "_id name"},
          {path: 'author', model : Author, select : '_id clerkId name picture'}
        ]
      })
      if(!user){
        throw new Error("User not found");
      }

      const savedQuestions = user.saved;
      return {questions: savedQuestions}


  } catch (error) {
    console.log(error);
    throw error;
    
  }
}
