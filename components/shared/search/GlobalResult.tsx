'use client'
import React, { useEffect, useState } from 'react';
import {ReloadIcon} from "@radix-ui/react-icons";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';
const GlobalResult = () => {

    const searchParams = useSearchParams();
  


    const [loading , setIsLoading ] = useState(false)

    const [result , setResult] = useState([
        {type : 'question', id:1, title:'Next js question'},
        {type : 'answer', id:2, title:'Next js '},
        {type : 'question', id:3, title:'React Js question'}
    ])
    const type = searchParams.get('type')
    const global = searchParams.get('global')
    
    const renderLink = (type: string, id: string) => {
        switch (type) {
            case 'question':
                return `/question/${id}`
            case 'answer':
                return `/question/${id}`
            case 'user':
                return `/profile/${id}`
            case 'tag':
                return `/tag/${id}`
            default:
                return `/question/${id}`
        }
    }
    useEffect(() => {

        const  fetchResult = async () => {
            setResult([]);
            setIsLoading(true)

            try     {
                
                //db call search evry thing
                const res = await globalSearch({query: global , type})
                setResult(JSON.parse(res));
                
            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }
        if(global) fetchResult();
    },[global, type])
    return (
        <div className='absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl ' >


            <div className="className my-5 h-[1px] bg-light-700/50 dark: bg-dark-500/50">
                <div className='space-y-5'>
                  <GlobalFilters />

                </div>
                {loading  ? (
                    <div className='flex-center flex col px-5'>
                        <ReloadIcon className='my-2 h-10 w-10 text-primary-500 animate-spin text-primary-500'/>
                        <p className='text-dark200_light800 body-regular'>Browsing entire App</p>
                    </div>
                ): (
                    <div className='flex flex-col gap-2 '>
                        {result.length > 0 ?(
                            result.map((item: any, index: number) => (
                                <Link
                                href={renderLink('type', 'id')}
                                key={item.type + item.id + index}
                                className='flex w-full cursor-pointer gap-3 px-5 py-2.5 hover:bg-light-700 dark:hover:bg-dark-500 transition-all ease-in-out duration-200 rounded-xl'
                                >

                                <div key={item.id} className='flex flex-col gap-2 px-5 py-3'>
                                    <p className='text-dark200_light800 body-regular'>{item.title}</p>
                                    <p className='text-dark300_light700 body-regular'>{item.description}</p>
                                </div>
                                <Image
                                src="/assets/icons/tag.svg"
                                width={20}
                                height={20}
                                alt="tag"
                                className='invert-colors mt-1 object-contain'

                                />
                                <div className='flex flex-col'>
                                    <p className='text-dark200_light800 line-clamp-1 body-regular'>{item.title}</p>
                                    <p className='text-dark200_light800 line-clamp-1 font-bold capitalize'>{item.type}</p>

                                </div>
                                </Link>
                            ))
                        ): (
                            <div className='flex-center flex-col px-5 '>
                                <p className='text-dark200_light800  body-regular px-5 py-2.5'></p> OOps no result found

                            </div>

                        )
                    
                    }






                    </div>
                )}
            </div>

        </div>
    );
};

export default GlobalResult;
