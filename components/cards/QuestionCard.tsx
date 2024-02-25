import React from 'react'


interface QuestionProps {
    _id: string;
    title: string;
    tags: {
      _id: string;
      name: string;
    }[];
    author: {
      _id: string;
      name: string;
      picture: string;
      clerkId: string;
    };
    upvotes: string[];
    views: number;
    answers: Array<object>;
    createdAt: Date;
    clerkId?: string | null;
  }
  
const QuestionCard = (
    {
        _id,
        title,
        tags,
        author,
        upvotes,
        views,
        answers,
        createdAt
    
    }:QuestionProps
) => {
  return (
    <div className='card-wrapper p-9 sm:px-11 rounded-[10px] '>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">

            <div>
                <span>
                    {String{createdAt}}
                </span>

            </div>


        </div>

        {title}



    </div>
  )
}

export default QuestionCard