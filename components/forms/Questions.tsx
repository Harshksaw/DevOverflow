"use client";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useRef } from 'react';

import { Button } from "@/components/ui/button";
import { Editor } from '@tinymce/tinymce-react';
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "../ui/badge";
import { createQuestion } from "@/lib/actions/question.action";
import { z } from "zod";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const type:any = 'Create'
interface Props{
  mongoUserId: string;
}


const Question = ({mongoUserId}: Props) => {

  const Router = useRouter();
  const pathName = usePathname();


  // tiny MCE
  const editorRef = useRef(null);
  const [isSubmitting , setIsSubmmitting] = React.useState(false);

  const log = () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
    }
  };

  const handleInputKeyDown = (e : React.KeyboardEvent<HTMLInputElement> , field: any)=>{
    
    if(e.key == 'Enter' && field.name == 'tags'){
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      
      if(tagValue !== '' ){
        if(tagValue.length > 15){
          return form.setError('tags', {
            type:'required',
            message: 'Tag should be less than 15 characters'  

        })
      }

      if(!field.value.includes(tagValue as never)){
        form.setValue('tags', [...field.value, tagValue]) ;
        tagInput.value =''
        form.clearErrors('tags');


      }
    }else{
      form.trigger();
    }
  }}

  const handleTagRemove = (tag: string, field: any)=>{
    const newTags = field.value.filter((t:string)=> t !== tag);

    form.setValue('tags', newTags);

  }


  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: []
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmmitting(true);

    try {
      //make an asyn call to your API --> create a quation

    
      //contain all form data
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
      })
        Router.push('/');
      //navigate to home page
    } catch (error) {

      
    }
    finally{
      setIsSubmmitting(false)
    }

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

              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* detailed explanation */}

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  // initialValue={parsedQuestionDetails?.content || ""}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter |" +
                      "alignright alignjustify | bullist numlist outdent indent",
                    content_style: "body { font-family:Inter; font-size:16px }"
                    // skin: mode === "dark" ? "oxide-dark" : "oxide",
                    // content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduces the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
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
                <>
                <Input
                  className="no-focus paragraph-regular backgorund-light900_dark300 light-boarder-2 text-dark300_light700 min-h-[56px] border"
                  placeholder="Add tags"

                onKeyDown={(e)=> handleInputKeyDown(e, field) }
                />

                {
                  field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {
                        field.value.map((tag:any)=>(
                          <Badge key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick= {()=> handleTagRemove(tag, field)}

                          >
                            {tag}
                            <Image
                            src="/assests/icons/close.svg"
                            alt="close icon"
                            width={12}
                            height= {12}
                            className="cursor-pointer object.contain invert-0 dark:Invert"
                            
                            />
                          </Badge>

                        ))
                      }


                    </div>
                  )
                }
                </>
              </FormControl>

              <FormDescription
                className="body-regular mt-2.5 text-light-500"
              >
                Add up to  3 tags to describe what your question is about
              </FormDescription>

              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button type="submit" className="primary-gradient w-full !text-light-800"
        disabled={isSubmitting}

        >
          {
            isSubmitting ? (
              <>
              {type === 'edit' ? 'Editing...'  : 'Posting...'}
              </>
            ): (
              <>
              {type === 'edit' ? 'Edit Question'  : 'Post Question'}
              </>

            )
          }
          
          
          </Button>
      </form>
    </Form>
  );
};


export default Question;
