


import LocalSearchBar from "@/components/shared/search/LocalSearch";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import NoResult from "@/components/shared/NoResult";

import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";

import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilter";



const questions= [
  // Existing questions
  {
    _id: '1',
    title: 'Cascading Delete in SQLAAlchemy?',
    tags: [{ _id: '1', name: 'python' }, { _id: '2', name: 'sql' }],
    author: { _id: 'johnId', name: 'John', picture: 'john.jpg', clerkId: 'clerk1' },
    upvotes: ['user1', 'user2', 'user3'],
    views: 100,
    answers: [
      { answerId: 'ans1', content: 'You can use the cascade option in relationships.' },
      { answerId: 'ans2', content: 'Check the SQLAlchemy documentation for more details.' },
    ],
    createdAt: new Date('2022-10-10'),
  },
  {
    _id: '2',
    title: 'How to center?',
    tags: [{ _id: '1', name: 'python' }, { _id: '3', name: 'css' }],
    author: { _id: 'harshId', name: 'Harsh', picture: 'harsh.jpg', clerkId: 'clerk2' },
    upvotes: ['user4', 'user5'],
    views: 120,
    answers: [
      { answerId: 'ans3', content: 'You can use the text-align property in CSS.' },
      { answerId: 'ans4', content: 'Flexbox and Grid layouts also provide centering options.' },
    ],
    createdAt: new Date('2021-10-10'),
  },
  // New questions
  {
    _id: '3',
    title: 'Best IDE for Python development?',
    tags: [{ _id: '1', name: 'python' }, { _id: '4', name: 'ide' }],
    author: { _id: 'aliceId', name: 'Alice', picture: 'alice.jpg', clerkId: 'clerk3' },
    upvotes: ['user6', 'user7', 'user8'],
    views: 80,
    answers: [{ answerId: 'ans5', content: 'PyCharm is widely used for Python development.' }],
    createdAt: new Date('2022-02-20'),
  },
  {
    _id: '4',
    title: 'Introduction to React Hooks?',
    tags: [{ _id: '5', name: 'react' }, { _id: '6', name: 'hooks' }],
    author: { _id: 'bobId', name: 'Bob', picture: 'bob.jpg', clerkId: 'clerk4' },
    upvotes: ['user9', 'user10'],
    views: 150,
    answers: [
      { answerId: 'ans6', content: 'React Hooks are functions that let you use state and other React features.' },
      { answerId: 'ans7', content: 'useState and useEffect are commonly used React Hooks.' },
    ],
    createdAt: new Date('2022-03-15'),
  },
  // Add more questions as needed
];



export default function Home() {

  return (
    <>
      <div>
        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>

      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      {/* // looping through questions */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}