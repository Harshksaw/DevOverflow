
"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { set } from "mongoose";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); 

  const [search, setSearch] = React.useState(query || '');
  const [isOpen, setisopen] = React.useState(false);


  useEffect(() => {
    const delayFn = setTimeout(() => {


      if(search){
        const newUrl =formUrlQuery({
          params: searchParams.toString(),
          key : 'global' ,
          value : search
        })
        router.push({
          pathname,
          search: newUrl,
        });
      }
      else{
        if(query){
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove : ['global', 'type']
          })
          router.push(newUrl, {scroll : false})
        }
      }
    }, 500);

  },[search , pathname, searchParams, router, query])


  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">

      <div
        className="background-light800_darkgradient 
      relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4"
      >
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search anything globally..."
          value={search}
          onChange={
            (e) => {setSearch(e.target.value);

            if(!isOpen) setisopen(true) 
            if(e.target.value == '' && isOpen) setisopen(false) 
          }}

          className="paragraph-regular no-focus placeholder  text-dark400_light700
          background-light800_darkgradient border-none shadow-none"
        />
      </div>
      {isOpen && <GlobalResult/>}
    </div>
  );
};

export default GlobalSearch;