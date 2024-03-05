"use server"

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { connectToDatabase } from "../moongoose";
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams){
    
    try{
        connectToDatabase();
        const { content, author, question , path} = params;

        const newAnswer= new Answer({
            content, author, question

        })

        await Question.findByIdAndUpdate(question, { $push: { answers: newAnswer._id } })

        //Todo add interaction

        revalidatePath(path);
    }
    catch{
        console.log("Error creating answer")
        throw error;
    }
}