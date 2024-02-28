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