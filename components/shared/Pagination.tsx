'use client'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

interface Props{
    pageNumber : number;
    isNext: boolean
}

const Pagination = ({pageNumber , isNext}: Props) => {


    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = (direction: string) => {
        const nextPageNumber = direction === 'prev'
        ? pageNumber -1 : pageNumber +1;


        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: nextPageNumber.toString()
        })
        router.push(newUrl)


    }

    return (
        <div className=' flex w-full item-center justify-center gap-2'>
            <Button
                disabled={pageNumber === 1}
                onClick={() => handleNavigation('prev')}
                className='light-border-2 border btn flex min-h-[36px] items-center justify-center'


            >
                <p className='body-medium text-dark200_light900' >Prev</p>

            </Button>
            <div className='bg-primary-500 flex justify-center items-center rounded-md bg-primary-500 rounded-md px-3.5 py-2'>
                <p className=' body-semibold text-slate-200 '>{Props.pageNumber} </p>

            </div>
            <Button
                disabled={!isNext}
                onClick={() => handleNavigation('next')}
                className='light-border-2 border btn flex min-h-[36px] items-center justify-center'


            >
                <p className='body-medium text-dark200_light900' >Next</p>

        </Button>
        </div>
    )
}

export default Pagination
