import { AnswerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";

const Answers = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef(null);
    const { mode } = useTheme();

    const form =
        useForm <
        z.infer<typeof AnswerSchema>({
            resolver: zodResolver(AnswerSchema),
            defaultValues: {
                answer: "",
            },
        });
    const handleSubmit = () => {
        console.log("submitting");
    };

    return (
        <div>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">

            <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
            <Button className="btn light-border-2 gap-1.5  rounded-md px-4 py-2.5 dark: text-primary-500 shadow-none dark:text-primary-500">
                <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
                >
                    Generate Ai Answer

                </Image>
            </Button>
        </div>

            <Form>
                <form
                    className="mt-6 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleCreateAnswer)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
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
                                            content_style:
                                                "body { font-family:Inter; font-size:16px }",
                                            skin: mode === "dark" ? "oxide-dark" : "oxide",
                                            content_css: mode === "dark" ? "dark" : "light",
                                        }}
                                    />
                                </FormControl>

                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            disabled={isSubmitting}
                            type="button"
                            className="primary-gradient w-fit text-gray-200 "
                        >
                            {isSubmitting ? "Submitting" : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Answers;
