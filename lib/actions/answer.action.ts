"use server"

import { CreateAnswerParams, GetAnswersParams, QuestionVoteParams } from "./shared.types";

import Answer from "@/database/answer.model";
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


    export async function upVoteQuestion(params: QuestionVoteParams){

        try{
            connectToDatabase();
            const { questionId, userId, hasupVoted, hasdownVoted , path} = params;

            let updateQuery={};

            if(hasupVoted){
                updateQuery = { $pull: { upvotes: userId } } 
            }else if(hasdownVoted){
                updateQuery= {
                    $pull: {downvotes: userId},
                    $push: {upvotes: userId}
                }
            }else{
                updateQuery = {$addToSet: {upvotes: userId}}
            }
            const question = await Question.findByIdAndUpdate(
                (questionId, updateQuery, {new: true})
                )

                if(!question){
                    throw new Error('Question not FOund');
                }


        }catch(err){
            console.log("Error upvoting answer")
            throw error;

        }
    }


    export async function downVoteQuestion(params: QuestionVoteParams){

        try{
            connectToDatabase();
            const { questionId, userId, hasupVoted, hasdownVoted , path} = params;

            let updateQuery={};

            if(hasdownVoted){
                updateQuery = { $pull: { downvote: userId } } 
            }else if(hasdownVoted){
                updateQuery= {
                    $pull: {upvotes: userId},
                    $push: {downvotes: userId}
                }
            }else{
                updateQuery = {$addToSet: {upvotes: userId}}
            }
            const question = await Question.findByIdAndUpdate(
                (questionId, updateQuery, {new: true})
                )

                if(!question){
                    throw new Error('Question not FOund');
                }

                revalidatePath(path);


        }catch(err){
            console.log("Error upvoting answer")
            throw error;

        }
    }