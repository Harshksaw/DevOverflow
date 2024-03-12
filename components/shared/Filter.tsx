"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";

import type { FilterProps } from "@/types";
import { SearchParams } from '../../lib/actions/shared.types';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

interface Props {
  filters:{
    name: string;
    value: string;
  }[];

  otherClasses?: string;
  containerClasses?: string;
}
const Filter = ({ filters, otherClasses, containerClasses }: Props) => {

  const SearchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = SearchParams.get('filter');


  const handleUpdateParams = (value : string)=>{
    const newUrl = formUrlQuery({
      params: SearchParams.toString() ,
      key : 'filter',
      value
    })
    router.push(newUrl , { scroll : false})
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue= {paramFilter || undefined}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>

        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
