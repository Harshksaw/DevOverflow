import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import RenderTag from './RenderTag'
const hotQuestions =[
    {_id:1 , title: 'How to use React Router', votes: 10, answers: 5},
    {_id:2 , title: 'How to use React Router', votes: 10, answers: 5},
    {_id:3 , title: 'How to use React Router', votes: 10, answers: 5},
    {_id:4 , title: 'How to use React Router', votes: 10, answers: 5},
    {_id:5 , title: 'How to use React Router', votes: 10, answers: 5},
]
const popularTags = [
    {_id:1, name:"React",totalQuestions: 10,},
    {_id:2, name:"TypeScript",totalQuestions: 5,}, {_id:3, name:"Node.js",totalQuestions: 7,},
    {_id:4, name:"Php",totalQuestions: 5,}, {_id:5, name:"C++",totalQuestions: 7,}

]

const RightSidebar = () => {


  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">

        <div className=''>
            <h3 className='h3-bold text-dark200_light900'>
                Questions
            </h3>
            <div className='mt-7 flex w-full flex-col  gap-[30px]'>
                {hotQuestions.map((question) => (
                    <Link href={`/questions/${question._id}`}
                    key={question._id}
                    className='flex items-center gap-4 bg-transparent p-1'
                    >
                        <p className='body-medium text-dark500_light700'>{question.title}</p>
                        <Image
                            src='/assets/icons/chevron-right.svg'
                            alt='Arrow Right'
                            width={20}
                            height={20}
                            className='invert-colors'/>

                    </Link>
                ))}

            </div>
            </div>        




        <div className='mt-16'>
        <h3 className='h3-bold text-dark200_light900'>
                    Popular Tags
            </h3>
            <div className='mt-7 flex flex-col gap-4'>
                    {
                        popularTags.map((tag) => (
                            <RenderTag 
                            key={tag._id}
                            _id ={tag._id}
                            name={tag.name}
                            totalQuestions={tag.totalQuestions}
                            showCount
                            />
                        ))
                    }
            </div>
            
            </div>        
      
    </section>
  )
}

export default RightSidebar
