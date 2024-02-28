'use server'

import Question from "@/database/question.model";


import { connectToDatabase } from "../moongoose"
import Tag from "@/database/tag.model";
import User from "@/database/user.models";
import { GetQuestionsParams } from "./shared.types";
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