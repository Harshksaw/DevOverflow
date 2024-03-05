import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"

import Image from "next/image"
import Link from "next/link"
import Metric from "@/components/shared/Metric"
import { getQuestionById } from "@/lib/actions/question.action"

const page = async ({ params, searchParams }) => {
    console.log(params)
    const result = await getQuestionById({ questionId: params.id })

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">

                    <Link href={`/profile/${result.author.clerkId}`}
                        className="flex items-center justify-start gap-1"
                    >
                        <Image
                            src={result.author.picture}
                            className="rounded-full"
                            width={22}
                            height={22}
                            alt="profile"

                        />
                        <p className="paragraph-semibold text-dark300_light700">

                            {result.author.name}
                        </p>
                    </Link>
                    <div className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
                        Voting
                    </div>




                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
                    {result.title}
                </h2>
                <div>
                    <Metric
                        imgUrl="/assets/icons/clock.svg"
                        alt="clock icon"
                        value={` asked ${getTimestamp(result.createdAt)}`}
                        title=" Asked"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/message.svg"
                        alt="message"
                        value={formatAndDivideNumber(result.answers.length)}
                        title=" Answers"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="eye"
                        value={formatAndDivideNumber(result.views)}
                        title=" Views"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
                <ParseHTML

            </div>
        </>
    )
}
export default Page