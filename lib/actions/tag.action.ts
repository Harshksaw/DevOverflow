"use server"

import User from "@/database/user.models";
import { connectToDatabase } from "../moongoose";
import { GetTopInteractedTagsParams } from "./shared.types";


export async function getTopInteractedTags(params : GetTopInteractedTagsParams){
    try {
      connectToDatabase();
        const {userId } = params;

  
      const user = await User.findById(userId)  

      if(!user) throw new Error("User not found");
  
        //FInd interaction for the user and group by tags...
        //Interaction...

        return [{_id : '1' , name : "tag"},{ _id : '2' , name : "tag2"},]

  
    } catch (error) {
      console.log(error);
      throw Error;
      
    }
  }