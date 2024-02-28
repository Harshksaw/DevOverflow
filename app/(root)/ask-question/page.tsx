import Question from '@/components/forms/Questions'
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  if(!userId) redirect('/sign-in')
  console.log(mongoUser)


  return (
    <div>
        Ask Question
        <Question  mongoUserId={JSON.stringify(mongoUser._id)} />
      
    </div>
  )
}

export default page
