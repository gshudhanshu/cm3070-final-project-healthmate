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

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    first_name: z.string().min(1, "First Name is required").max(100),
    last_name: z.string().min(1, "Last Name is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    re_password: z.string().min(1, "Password confirmation is required"),
    account_type: z.enum(["patient", "doctor"]),
  })
  .refine((data) => data.password === data.re_password, {
    path: ["re_password"],
    message: "Password do not match",
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
    name: "first_name",
    label: "First Name",
    placeholder: "first name",
    type: "text",
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "last name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "mail@example.com",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
  {
    name: "re_password",
    label: "Re-Enter your password",
    placeholder: "Re-Enter your password",
    type: "password",
  },
  {
    name: "account_type",
    label: "Account Type",
    type: "radio",
    types: ["patient", "doctor"],
  },
];

export default function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      re_password: "",
      account_type: "patient",
    },
  });

  const [serverErrorMessages, setServerErrorMessages] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [registrationStatusMessage, setRegistrationStatusMessage] =
    useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${process.env.API_URL}/auth/users/`,
        values,
        { headers },
      );

      if (response.status === 201) {
        console.log("User created successfully");
        setRegistrationStatusMessage(
          "Registration successful! Please check your email to activate your account.",
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 5000);
      }
      console.log(response);
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data) {
        // Parse error response from Djoser
        setServerErrorMessages(error.response.data);
      } else {
        // Handle other types of errors (network error, etc.)
        setServerErrorMessages({
          non_field_errors: ["An unknown error occurred."],
        });
      }
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex justify-center">
        <PlusBox />
      </div>
      <h1 className="text-center text-2xl font-bold">Join Our Community</h1>
      <div>
        {/* Display server error messages if they exist */}
        {serverErrorMessages &&
          Object.entries(serverErrorMessages).map(([field, errors]) => (
            <div key={field} className="text-center text-destructive">
              {field}: {Array.isArray(errors) ? errors.join(", ") : errors}
            </div>
          ))}
        {/* Display registration status message if it exists */}
        {registrationStatusMessage && (
          <div className="text-center text-primary">
            {registrationStatusMessage}
          </div>
        )}
      </div>
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
              <Link
                href="/auth/forgot-password"
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
