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

// Defining form schema and field configurations
const formSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
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
    name: "username",
    label: "Username",
    placeholder: "username",
    type: "text",
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
];

export default function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // Initializing useRouter and useForm hooks
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // State variable for server error message
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const { login } = useAuthStore();

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Attempting to login with provided credentials
    try {
      await login(values.username, values.password);
      // Redirecting to dashboard on successful login
      router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      // Extract and display error message from server response
      const message =
        error.response?.data?.detail || "An unknown error occurred";
      setServerErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex justify-center">
        <PlusBox />
      </div>
      <h1 className="text-center text-2xl font-bold">Login to Your Aaccount</h1>
      {/* Display server error messages if they exist */}
      <div>
        {serverErrorMessage && (
          <div className="text-center text-destructive">
            Error: {serverErrorMessage}
          </div>
        )}
      </div>
      {/* Rendering the login form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {formFieldsConfig.map((fieldData) =>
            fieldData.type === "radio" ? (
              <FormField
                key={fieldData.name}
                control={form.control}
                name={fieldData.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {fieldData.types?.map((type) => (
                          <FormItem
                            key={type}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {type}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              // Rendering input field for other types
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
            ),
          )}
          {/* Submit button */}
          <Button type="submit">Submit</Button>
          {/* Links for registration and forgot password */}
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
              <Link
                href="/auth/forget-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </FormDescription>
          </div>
        </form>
      </Form>
    </div>
  );
}
