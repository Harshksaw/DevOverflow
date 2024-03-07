"use cient";

import { downVoteQuestion, upVoteQuestion } from "@/lib/actions/answer.action";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import React from "react";
import { ToggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;

  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasdownVoted,
  hasupVoted,
  hasSaved,
  downvotes,
}: Props) => {
const pathname = usePathname();
const router = useRouter();

const handleSave = async()=>{
  await ToggleSaveQuestion({
    userId :JSON.parse(userId) ,
    questionId : JSON.parse(itemId),
    path: pathname,
  })
}

const handleVote = async(action: string)=>{

  if(!userId){
    return
  }
  
  if(action === 'upvote'){
    if(type === 'Question'){
      await upVoteQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasupVoted,
        hasdownVoted,
        path: pathname,
      })
    }else if(action === 'Answer'){
      // await upvoteAnswer({

      // }
      
      // )
    }
    return;



    }  
  
    if(action === 'downvote'){
      if(type === 'Question'){
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        })
      }else if(type === 'Answer'){
        // await downvoteAnswer({
  
        // }
        
        // )
      }
      return;
    }
  
      
      }  

  
  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5 ">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvote.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center backrgound-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center backrgound-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            width={18}
            height={18}
            alt="start"
            className="cursor-pointer"
            onClick={handleSave}
          />
    </div>
  );
};

export default Votes;

