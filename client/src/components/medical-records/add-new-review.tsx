// Import necessary libraries
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/common/error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useReviewStore } from "@/store/useReviewStore";
import { useMessagesStore } from "@/store/useMessageStore";
import { parse } from "path";

// Define Zod schema for form validation
const reviewFormSchema = z.object({
  comment: z.string().min(1, "Please enter a comment"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
  conversation_id: z.coerce.number().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ReviewForm() {
  const { addReview } = useReviewStore();
  const { selectedConversation } = useMessagesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
  });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      comment: "",
      rating: 1,
      conversation_id: selectedConversation
        ? Number(selectedConversation.id) || 0
        : 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ReviewFormValues) => {
    console.log("Submitting review:", data);
    addReview(data);
  };

  if (!selectedConversation) {
    return <ErrorComponent message="Please select a conversation" />;
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-lg font-semibold">Add New Review</h2>

        <FormField
          control={form.control}
          name="conversation_id"
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversation Id</FormLabel>
              <FormControl>
                <Input
                  placeholder="Doe"
                  {...field}
                  value={selectedConversation.id || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 ⭐</SelectItem>
                  <SelectItem value="2">2 ⭐⭐</SelectItem>
                  <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your review here..."
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Review</Button>
      </form>
    </Form>
  );
}
