"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Questions = () => {
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title:"",
      explanation:"",
      tags:[]
    },
  });

  function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex w-full flex-col gap-10">
        <FormField

          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem
            className="flex w-full  flex-col"
            >
              <FormLabel
              className="paragraph-semibold text-dark400_light800"
              >Question Title
              <span
              className="text-primary-500"
              >*

              </span>

                </FormLabel>
              <FormControl
              className="mt-3.5"
              >
                <Input placeholder="shadcn" {...field} 
                className="no-focus paragraph-regilar backgorund-light700_dark300 light-boarder-2 text-dark300_light700 min-h-[56px] border"
                {...field}
                />
              </FormControl>
              <FormDescription
              className="body-regular mt-2.5 text-light-500"
              >
                Be specific and imagin you &apos;re asking a Question to another person
              </FormDescription>
              
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        {/* detailed explanation */}
        <FormField
        className
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem
            className="flex w-full  gap-3"
            >
              <FormLabel
              className="paragraph-semibold text-dark400_light800"
              >Detailed Expalnation of your Problem?
              <span
              className="text-primary-500"
              >*

              </span>

                </FormLabel>
              <FormControl
              className="mt-3.5"
              >
                {/* todo add an editor */}
                {/* <Input placeholder="shadcn" {...field} 
                className="no-focus paragraph-regilar backgorund-light700_dark300 light-boarder-2 text-dark300_light700 min-h-[56px] border"
                {...field}
                /> */}
              </FormControl>
              <FormDescription
              className="body-regular mt-2.5 text-light-500"
              >
                Introduce the problem and expand on what you put in the title. Minimum 20 character
              </FormDescription>

              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />
        <FormField

          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem
            className="flex w-full  flex-col"
            >
              <FormLabel
              className="paragraph-semibold text-dark400_light800"
              >Tags
              <span
              className="text-primary-500"
              >*

              </span>

                </FormLabel>
              <FormControl
              className="mt-3.5"
              >
                <Input 
                className="no-focus paragraph-regular backgorund-light900_dark300 light-boarder-2 text-dark300_light700 min-h-[56px] border"
                placeholder ="Add tags"
                
                {...field}
                />
              </FormControl>
              <FormDescription
              className="body-regular mt-2.5 text-light-500"
              >
               Add up to  3 tags to describe what your question is about
              </FormDescription>

              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Questions;
