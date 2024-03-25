"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Defining form schema using zod
const formSchema = z.object({
  email: z.string().min(1, "Username is required").max(100),
});
type FormSchema = z.infer<typeof formSchema>;
type FormFieldNames = keyof FormSchema;

// Configuration for form fields
const formFieldsConfig: Array<{
  name: FormFieldNames;
  label: string;
  placeholder?: string;
  type: string;
  types?: string[];
}> = [
  {
    name: "email",
    label: "Email",
    placeholder: "example@email.com",
    type: "email",
  },
];

export default function ForgetForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [serverErrorMessage, setServerErrorMessage] = useState("");

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the API to send the password reset email
      await axios.post(
        `${process.env.API_URL}/auth/users/reset_password/`,
        values,
      );

      // Display success message using toast
      toast({
        title: "Reset password email sent",
        description:
          "An email has been sent to you with instructions on how to reset your password",
      });

      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      // Display error message using toast
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "Email not found in the system or invalid email address",
      });
      // Extract and display error message from server response
      const message =
        error.response?.data?.detail ||
        "Email not found in the system or invalid email address";
      setServerErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {/* PlusBox for decorative purpose */}
      <div className="flex justify-center">
        <PlusBox />
      </div>
      {/* Title */}
      <h1 className="text-center text-2xl font-bold">Forget password</h1>
      {/* Display server error messages if they exist */}
      <div>
        {serverErrorMessage && (
          <div className="text-center text-destructive">
            Error: {serverErrorMessage}
          </div>
        )}
      </div>
      {/* Form component */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {/* Rendering form fields dynamically */}
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
          {/* Submit Button */}
          <Button type="submit">Submit</Button>
          {/* Links for registration and login */}
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
