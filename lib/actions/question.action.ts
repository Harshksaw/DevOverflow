'use server'

import { GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.models";
import { connectToDatabase } from "../moongoose"
import { revalidatePath } from "next/cache";

export async function createQuestion(params: any) {

    try {
        connectToDatabase();  //connection
        
        const {title, content, tags , author , path} = params;

        //create a wquations 
        const question = await Question.create({
            title,
            content,
            // tags,
            author,

        });

        const tagDocuments = [];
        //create the tags or get them if they already exist

        for(const tag of tags){
            const existingTag = await Tag.findOneAndUpdate(
                    {name: { $regex: new RegExp(`^${tag}$`, "i") }},
                    {$setOnInsert: {name: tag},$push: {question: question._id}},
                    {upsert: true , new :  true}
            )

            tagDocuments.push(existingTag);

        }

        await Question.findByIdAndUpdate(question._id,  {$push: {
            tags: { $each : tagDocuments }
        }})

        revalidatePath(path)

    } catch (error) {
        console.log(error, "in question.action.ts");

        
    }
    
}


export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

            const questions = await Question.find({})
            .populate({path:'tags', model: Tag})
            .populate({path: 'author', model: User})
            .sort({createdAt: -1   })
            

            // return questions;
            return {questions}

      
    } catch (error) {
        console.log(error, "in question.action.ts");
        
    }
}

export async function getQuestionById(params: GetQuestionByIdParams )   {
    try {
        connectToDatabase();
        const { questionId } = params;
        const question = await Question.findById(questionId)
        .populate({path:'tags', model: Tag, select : '_id name'})
        .populate({path: 'author', model: User, select: '_id clerkId name picture'})
        

        
        
    } catch (error) {
        console.log(error, "in question.action.ts");
        throw error;
        
    }
}

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
        // const question = await Question.findByIdAndUpdate(
        //     (questionId, updateQuery, {new: true})
        //     )

            // if(!question){
            //     throw new Error('Question not FOund');
            // }


    }catch(err){
        console.log("Error upvoting answer")
        throw err;

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
        // const question = await Question.findByIdAndUpdate(
        //     (questionId, updateQuery, {new: true})
        //     )

            // if(!question){
            //     throw new Error('Question not FOund');
            // }

            revalidatePath(path);


    }catch(err){
        console.log("Error upvoting answer")
        throw err;

    }
}