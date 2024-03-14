'use client'

import React, { useState } from 'react';

import { GlobalSearchFilters } from '@/constants/filters';
import { Item } from '@radix-ui/react-menubar';
import { formUrlQuery } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

interface GlobalFiltersProps {
    // Add your prop types here
}

const GlobalFilters: React.FC<GlobalFiltersProps> = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const typeParams = searchParams.get('type') || '';

    const [active , setActive] = useState(typeParams || '')
    
    const handleTypeClick = (item: string)=>{
        if(active === item){

            setActive("")
            const newUrl = formUrlQuery({
              params: searchParams.toString(),
              key: 'type',
              value: null
            })
            router.push(newUrl , {scroll: false});
          }
            else{
              setActive(item)
              const newUrl = formUrlQuery({
                params : searchParams.toString(),
                key: 'type',
                value : item.toLowerCase()
              })
              router.push(newUrl , {scroll: false});
            }

    }

    // Add your component logic here

    return (
        <div className='flex items-center gap-5 px-5'>
            <p className='text-dark400_light900 body-medium'>
                <div className="flex gap-3">
                {GlobalSearchFilters.map((item, index) => (

                    <button
                    type='button'
                    key={item.value}
                    className={`light-border-2 small-medium rounded-2xl px-5 py-2  dark : text-ight-800  capitalize dark:text-dark400_light900 dark:hover:bg-dark200_light800 dark:hover:text-dark400_light900 hover:bg-light200_light900 hover:text-light400_light900
                    ${active === item.value ? 'bg-light200_light900 text-light400_light900' : ''}` }
                    onClick={()=> handleTypeClick}
                    >
                        {Item.name}
                    </button>

                ))}

                </div>

            </p>
            {/* Add your JSX code here */}
        </div>
    );
};

export default GlobalFilters;



