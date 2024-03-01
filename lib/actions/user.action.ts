'use server'

import User from "@/database/user.models";
import { connectToDatabase } from "../moongoose"
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
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import page from '../../app/(root)/community/page';
  

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