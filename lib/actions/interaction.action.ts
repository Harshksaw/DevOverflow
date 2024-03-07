import Question from "@/database/question.model";
import { connectToDatabase } from "../moongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import { use } from "react";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        connectToDatabase();
        const { questionId, userId } = params;
        //update the view counr for the question

        await Question.findByIdAndUpdate(questionId, {$inc: {views: 1}});

        //create an interaction record
        if(userId){

            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: 'view',
                question: questionId,

            })
            if(existingInteraction){
                return console.log('Question already viewed');
            }
            await Interaction.create({
                user : userId,
                action: 'view',
                question: questionId,
            });

        }



    } catch (error) {
        console.error('Error viewing question', error);
        throw error;
        
    }
}