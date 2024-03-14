'use server'

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import { model } from "mongoose";

const SearchableTypes = ['question', 'user', 'answer', 'tag'];

export async function globalSearch(params: SearchParams) {

    try {
        connectToDatabase();

        const { query, type } = params;
        console.log(query, type)

        //db call search evry thing
        const regexQuery = { $regex: query, $options: 'i' };

        let results = [];

        const modelsAndTypes = [
            { model: Question, searchField: 'title', type: 'question' },
            { model: User, searchField: 'name', type: 'user' },
            { model: Answer, searchField: 'content', type: 'answer' },
            { model: Tag, searchField: 'title', type: 'tag' },
        ]
        const typeLower = type?.toLowerCase();
        if (!typeLower || !SearchableTypes.includes(typeLower)) {


            for (const { model, searchField, type } of modelsAndTypes) {
                const queryResults = await model
                    .find({ [searchField]: regexQuery })
                    .limit(2)

                results.push(
                    ...queryResults.map((item) => ({
                        title: type === 'answer' ?
                            `Answers contatining ${query}`
                            :
                            item[searchField] , 

                        type,
                        id: type === 'user' ?
                            item.clerkid
                            : type === 'answer'
                                ? item.question : item._id
                    }))
                )

            }
            //Search across everything

        } else {
            //for specifc type
            const modelInfo = modelsAndTypes.find((item) => item.type === type)

            if (!modelInfo) {
                throw new Error('Invalid type')
            }

            const queryResults = await modelInfo.model
                .find({ [modelInfo.searchField]: regexQuery })
                .limit(8)

            results = queryResults.map((item) => ({
                title: type === 'answer' ?
                    `Answers contatining ${query}`
                    :
                    item[modelInfo.searchField],

                type,
                id: type === 'user' ?
                    item.clerkid
                    : type === 'answer'
                        ? item.question : item._id
            }))
        }

        return JSON.stringify(results)





    } catch (error) {
        console.log(error)

    }





}