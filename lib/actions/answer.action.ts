"use server"

import Answer from "@/database/answer.model";
import { GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { connectToDatabase } from "../moongoose";
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams){
    
    try{
        connectToDatabase();
        const { content, author, question , path} = params;

        const newAnswer = await  Answer.create({
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

export async function getAnswers(params : GetAnswersParams){
    try{
        connectToDatabase();
        const { questionId } = params;

        const answers = await Answer.find({question:questionId})    
        .populate("author", "_id clerkId name picture")
        .sort({createdAt : -1})

        return {answers};


    }catch{
        console.log("Error getting answers")
        throw error;
    }}