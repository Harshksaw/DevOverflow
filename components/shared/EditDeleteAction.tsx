"use client"
import { deleteAnswer, deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react'
interface Props{
    type: string;
    itemId: string;

}
const EditDeleteAction = ({


    type,
    itemId
}: Props) => {
    const pathname = usePathname();

    const router = useRouter();



    const handleEdit = () => {

        router.push(`/question/edit/${JSON.parse(itemId)}`)
    }
    const handleDelete =async () => {

        if(type == 'Question'){

            await deleteQuestion({questionId: JSON.parse(itemId ), path: pathname})
        }else if(type =='Answer'){
            await deleteAnswer({answerId: JSON.parse(itemId), path: pathname})
        }
    
        
    }


  return (
    <div className='flex items-center justify-end max-sm:w-full  gap-3'>
        {type === "Question" && (
            <Image
            src="/assets/icons/edit.svg"
            alt="Edit"
            width={14}
            height={14}
            className='cursor-pointer object-contain'
            onClick={handleEdit}
            />
        )}
         <Image
            src="/assets/icons/delete.svg"
            alt="Edit"
            width={14}
            height={14}
            className='cursor-pointer object-contain'
            onClick={handleDelete}
            />
      
    </div>
  )
}

export default EditDeleteAction
