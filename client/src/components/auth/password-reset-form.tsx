"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PlusBox from "@/components/plus-box";
import { useState } from "react";
import { toast } from "../ui/use-toast";

const formSchema = z
  .object({
    uid: z.string(),
    token: z.string(),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    re_new_password: z
      .string()
      .min(8, "Confirmation password must be at least 8 characters long"),
  })
  .refine((data) => data.new_password === data.re_new_password, {
    message: "Passwords do not match",
    path: ["re_new_password"],
  });
type FormSchema = z.infer<typeof formSchema>;
type FormFieldNames = keyof FormSchema;

const formFieldsConfig: Array<{
  name: FormFieldNames;
  label: string;
  placeholder?: string;
  type: string;
  types?: string[];
}> = [
  {
    name: "new_password",
    label: "New Password",
    placeholder: "Enter your new password",
    type: "password",
  },
  {
    name: "re_new_password",
    label: "Confirm New Password",
    placeholder: "Confirm your new password",
    type: "password",
  },
];

export default function ForgetForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: params.uid as string,
      token: params.token as string,
      new_password: "",
      re_new_password: "",
    },
  });

  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the API to send the password reset email
      await axios.post(
        `${process.env.API_URL}/auth/users/reset_password_confirm/`,
        values,
      );

      toast({
        title: "Password reset successful",
        description:
          "Your password has been reset successfully. You can now login with your new password",
      });

      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "Unknown error occurred. Please try again",
      });
      // Extract and display error message from server response
      const message =
        error.response?.data?.detail ||
        "Unknown error occurred. Please try again";
      setServerErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex justify-center">
        <PlusBox />
      </div>
      <h1 className="text-center text-2xl font-bold">Password reset</h1>
      {/* Display server error messages if they exist */}
      <div>
        {serverErrorMessage && (
          <div className="text-center text-destructive">
            Error: {serverErrorMessage}
          </div>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {formFieldsConfig.map((fieldData) => (
            <FormField
              key={fieldData.name}
              control={form.control}
              name={fieldData.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldData.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={fieldData.placeholder}
                      type={fieldData.type}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
          <div className="mb-8 flex items-center justify-between">
            <FormDescription>
              Don&rsquo;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                Register
              </Link>
            </FormDescription>
            <FormDescription>
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </FormDescription>
          </div>
        </form>
      </Form>
    </div>
  );
}
