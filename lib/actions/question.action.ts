'use server'

import Question from "@/database/question.model";


import { connectToDatabase } from "../moongoose"
import Tag from "@/database/tag.model";


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

    } catch (error) {
        console.log(error, "in question.action.ts");

        
    }
    
}