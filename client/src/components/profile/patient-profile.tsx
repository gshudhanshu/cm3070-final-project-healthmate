"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Textarea } from "@/components/ui/textarea";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { PatientProfile } from "@/types/user";
// import { toast } from "@/components/ui/toast"

// Define address schema
const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

// Define language schema
const LanguageSchema = z.object({
  name: z.string(),
});

// Define constants for file upload
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define profile form schema
const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dob: z.date().optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  gender: z.enum(["male", "female", "other"]),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  blood_group: z.string().optional(),
  languages: z
    .array(LanguageSchema)
    .length(1, "At least one language is required"),
  address: AddressSchema,
  timezone: z.string().optional(),
  profile_pic: z
    .any()
    .optional()
    .refine((file) => file?.length == 1, {
      message: "Image is required.",
    })
    .refine(
      (files) => {
        return ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type);
      },
      {
        message: ".jpg, .jpeg, .png, and .webp files are accepted.",
      },
    )
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max file size is 5MB.`,
    }),
});

// Define type for profile form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function PatientProfileForm() {
  const { updateUserProfile, fetchPatientProfile, patientProfile } =
    useUserProfileStore();
  const { toast } = useToast();

  const { user } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState("");

  // Set default form values
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

  // Initialize form using useForm hook
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });
  const profilePicRef = form.register("profile_pic");

  // useFieldArray hook for languages field
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  // Fetch patient profile on component mount
  useEffect(() => {
    if (user?.username) {
      const loadProfile = async () => {
        const patientProfile = await fetchPatientProfile(user?.username);
        // Ensure doctorProfile data is available
        // Then use reset to update form with async fetched values
        setFormDefaultValues((prevValues) => ({
          ...prevValues,
          first_name: patientProfile?.user.first_name,
          last_name: patientProfile?.user.last_name,
          email: patientProfile?.user.email,
          phone: patientProfile?.phone || "",
          dob: patientProfile?.dob ? new Date(patientProfile?.dob) : undefined,
          marital_status:
            patientProfile?.marital_status as (typeof profileFormSchema.shape.marital_status._def.values)[number],
          gender:
            patientProfile?.gender as (typeof profileFormSchema.shape.gender._def.values)[number],
          height: patientProfile?.height || undefined,
          weight: patientProfile?.weight || undefined,
          blood_group: patientProfile?.blood_group || "",
          address: {
            street: patientProfile?.address?.street || "",
            city: patientProfile?.address?.city || "",
            state: patientProfile?.address?.state || "",
            postal_code: patientProfile?.address?.postal_code || "",
            country: patientProfile?.address?.country || "",
          },
          languages: patientProfile?.languages || [{ name: "" }],
          timezone: patientProfile?.user?.timezone || "UTC",
        }));
      };
      loadProfile();
    }
  }, [user]);

  // Reset form when default values change
  useEffect(() => {
    form.reset(formDefaultValues);
  }, [formDefaultValues, patientProfile]);

  // Update previewUrl when profile_pic field changes
  useEffect(() => {
    if (form.watch("profile_pic")?.[0]) {
      const file = form.watch("profile_pic")[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  }, [form.watch("profile_pic")]);

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    if (user.account_type !== "patient") return;
    try {
      // Format data
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
        dob: data.dob ? format(data.dob, "yyyy-MM-dd") : undefined,
        marital_status: data.marital_status,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        blood_group: data.blood_group,
        profile_pic: data.profile_pic[0] ? data.profile_pic[0] : undefined,
      };
      // Update user profile
      updateUserProfile(user.username, user.account_type, formattedData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Profile update failed",
        description:
          "An error occurred while updating your profile. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        data-testid="patient-profile-form"
      >
        <h1 className="py-8 text-center text-3xl font-medium">
          Edit your profile
        </h1>

        {/* Personal Identification Information */}
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
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
          {/* Last Name */}
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

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
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
          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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

          {/* Profile Picture */}
          <div className="flex items-end justify-center gap-3">
            {/* Image preview */}
            {patientProfile?.profile_pic && (
              <Avatar className="h-16 w-16 rounded-full object-cover">
                <AvatarImage
                  src={previewUrl || patientProfile?.profile_pic}
                  alt="Profile Preview"
                />
                <AvatarFallback>No Image</AvatarFallback>
              </Avatar>
            )}
            {/* Profile Picture Input */}
            <FormField
              control={form.control}
              name="profile_pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...profilePicRef}
                      // onChange={handleProfilePicChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Contact Information section */}
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email */}
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
          {/* Phone */}
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
        </div>

        {/* Address Details section */}
        <h2 className="text-xl font-semibold">Address Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Street Address */}
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
          {/* City */}
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
          {/* State */}
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
          {/* Postal Code */}
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
          {/* Country */}
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
        </div>

        {/* Medical History section */}
        <h2 className="text-xl font-semibold">Medical History</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Marital Status */}
          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
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
          {/* Blood Group */}
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
        </div>

        {/* Additional Personal Details */}
        <h2 className="text-xl font-semibold">Additional Details</h2>
        <div className="grid grid-cols-1 gap-4">
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
                        <Input {...field} data-testid="language-input" />
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
                Remove
              </Button>
            </div>
          </div>
          <p className="text-destructive">
            {form.formState.errors.languages?.message}
          </p>
        </div>
        {/* Timezone */}
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
        {/* Submit Button */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
