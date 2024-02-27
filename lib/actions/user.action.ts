'use server'

import User from "@/database/user.models";
import { connectToDatabase } from "../moongoose"

export async function getUserById(params: any) {

    try {
        
        connectToDatabase();
        const {userId} = params:

        const user = await User.findOne({clerkId : userId});
        return user;

    } catch (error) {
        console.log(error, " -->in user.action.ts");
        
    }
}