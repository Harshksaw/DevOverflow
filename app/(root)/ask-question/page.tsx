import Question from '@/components/forms/Questions'
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {

  // const {userId} = auth();
  //dummy data

  const userId = "1234567"
  if(!userId) redirect('/sign-in')
  const mongoUser = await getUserById({userId});
  console.log(mongoUser)


  return (
    <div>
        Ask Question
        <Question mongoUserId = {JSON.stringify(mongoUser._id)} />
      
    </div>
  )
}

export default page
