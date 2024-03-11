"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
// import { toast } from "@/components/ui/toast"

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const LanguageSchema = z.object({
  name: z.string(),
});

const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dob: z.date().optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().optional(),
  weight: z.number().optional(),
  blood_group: z.string().optional(),
  languages: z.array(LanguageSchema).optional(),
  address: AddressSchema,
  timezone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function PatientProfileForm() {
  const {
    updateUserProfile,
    //  fetchPatientProfile, patientProfile
  } = useUserProfileStore();
  const { user } = useAuthStore();

  const [formDefaultValues, setFormDefaultValues] = useState<
    Partial<ProfileFormValues>
  >({
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    languages: [{ name: "" }],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const { reset } = form;

  //   useEffect(() => {
  //     if (!user) return;
  //     const loadProfile = async () => {
  //       await fetchPatientProfile(user?.username);
  //       // Ensure doctorProfile data is available here
  //       // Then use reset to update form with async fetched values
  //       setFormDefaultValues({
  //         ...formDefaultValues,
  //         first_name: patientProfile?.user.first_name,
  //         last_name: patientProfile?.user.last_name,
  //         email: patientProfile?.user.email,
  //         phone: patientProfile?.phone || "",
  //         dob: patientProfile?.dob ? new Date(patientProfile?.dob) : undefined,
  //         marital_status: patientProfile?.marital_status || "single",
  //         gender: patientProfile?.gender || "other",
  //         height: patientProfile?.height || undefined,
  //         weight: patientProfile?.weight || undefined,
  //         blood_group: patientProfile?.blood_group || "",
  //         address: {
  //           street: patientProfile?.address?.street || "",
  //           city: patientProfile?.address?.city || "",
  //           state: patientProfile?.address?.state || "",
  //           postal_code: patientProfile?.address?.postal_code || "",
  //           country: patientProfile?.address?.country || "",
  //         },
  //         languages: patientProfile?.languages || [{ name: "" }],

  //       });
  //     };
  //     loadProfile();
  //   }, [user, fetchPatientProfile]);

  useEffect(() => {
    form.reset(formDefaultValues);
  }, [formDefaultValues]);

  function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    if (user.account_type !== "patient") return;
    try {
      const formattedData = {
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          timezone: data.timezone,
          username: user.username,
        },
        languages: data.languages,
        address: data.address,
        phone: data.phone,
      };
      updateUserProfile(user.username, user.account_type, formattedData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="py-8 text-center text-3xl font-medium">
          Edit your profile
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dob */}

          {/* <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Date of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marital status */}

          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input placeholder="height" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blood group */}
          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood group</FormLabel>
                <FormControl>
                  <Input placeholder="blood group" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="000 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Hospital address */}
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street address</FormLabel>
                <FormControl>
                  <Input placeholder="street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input placeholder="postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Input placeholder="timezone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Languages */}
          <div>
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex gap-6">
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`languages.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Languages
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="flex gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendLanguage({ name: "" })}
              >
                Add Language
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => removeLanguage(languageFields.length - 1)}
              >
                Remove Speciality
              </Button>
            </div>
          </div>
        </div>
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
