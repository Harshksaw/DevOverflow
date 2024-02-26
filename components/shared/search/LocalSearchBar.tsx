"use client";
import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";

interface LocalSearchBarProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchBarProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex items-center min-h-[56px] gap-4 rounded-[10px] px-4  ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          width={24}
          height={22}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-1px shadow-light-100 outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          width={24}
          height={25}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
