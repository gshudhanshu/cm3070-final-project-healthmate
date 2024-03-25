"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { DoctorProfile } from "@/types/user";
// import { toast } from "@/components/ui/toast"

// Validation schema for address fields
const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

// Validation schema for speciality fields
const SpecialitySchema = z
  .object({
    name: z.string(),
    level: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.name && data.level) {
        return ["native", "fluent", "conversational", "basic"].includes(
          data.level,
        );
      }
      return true;
    },
    {
      message:
        "Level is required if a language name is provided and must be 'native', 'fluent', 'conversational', or 'basic'.",
    },
  );

// Validation schema for language fields
const LanguageSchema = z.object({
  name: z.string(),
  level: z.enum(["native", "fluent", "conversational", "basic"]),
});

// Validation schema for qualification fields
const QualificationSchema = z.object({
  name: z.string(),
  university: z.string(),
});

// Maximum file size for profile picture
const MAX_FILE_SIZE = 5000000;
// Accepted image mime types
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Create an array of time strings from 00:00 to 24:00
const createTimeArray = (): [string, ...string[]] =>
  Array.from(
    { length: 24 },
    (_, hour) => `${hour.toString().padStart(2, "0")}:00:00`,
  ) as [string, ...string[]];

// Profile form validation schema
const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  timezone: z.string(),
  phone: z.string().optional(),
  hospital_address: AddressSchema,
  specialties: z.array(SpecialitySchema).refine(
    (data) => {
      return data.length > 0;
    },
    {
      message: "At least one speciality is required",
    },
  ),
  qualifications: z.array(QualificationSchema).refine(
    (data) => {
      return data.length > 0;
    },
    {
      message: "At least one qualification is required",
    },
  ),
  experience: z.coerce
    .number()
    .min(0, "Experience must be a positive number")
    .optional(),
  languages: z.array(LanguageSchema).refine(
    (data) => {
      return data.length > 0;
    },
    {
      message: "At least one language is required",
    },
  ),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  currency: z.string().max(3, "Currency code must be 3 characters"),
  description: z.string(),
  availability: z.enum(["full-time", "part-time", "weekends", "evenings"]),
  availability_end: z.enum(createTimeArray()),
  availability_start: z.enum(createTimeArray()),
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

// Infer the type of the profile form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function DoctorProfileForm() {
  // Initialize hooks and state variables
  const { updateUserProfile, fetchDoctorProfile, doctorProfile } =
    useUserProfileStore();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState("");
  const [formDefaultValues, setFormDefaultValues] = useState<
    Partial<ProfileFormValues>
  >({
    hospital_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    specialties: [{ name: "" }],
    qualifications: [{ name: "", university: "" }],
    languages: [{ name: "", level: "native" }],
  });

  // Initialize react-hook-form with zod resolver
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Register profile picture field
  const profilePicRef = form.register("profile_pic");

  // UseFieldArray for managing dynamic arrays of fields
  const {
    fields: specialtyFields,
    append: appendSpecialty,
    remove: removeSpecialty,
  } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  // UseFieldArray for managing dynamic arrays of fields
  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  // UseFieldArray for managing dynamic arrays of fields
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const doctorProfile: DoctorProfile = await fetchDoctorProfile(
        user?.username,
      );
      // Ensure doctorProfile data is available
      // Then use reset to update form with async fetched values
      setFormDefaultValues({
        ...formDefaultValues,
        first_name: doctorProfile?.user.first_name,
        last_name: doctorProfile?.user.last_name,
        email: doctorProfile?.user.email,
        phone: doctorProfile?.phone || "",
        experience: parseInt(doctorProfile?.experience || "") || 0,
        cost: parseInt(doctorProfile?.cost || "") || 0,
        currency: doctorProfile?.currency || "",
        description: doctorProfile?.description || "",
        timezone: doctorProfile?.user.timezone || "",
        availability:
          doctorProfile?.availability as (typeof profileFormSchema.shape.availability._def.values)[number],

        hospital_address: {
          street: doctorProfile?.hospital_address?.street || "",
          city: doctorProfile?.hospital_address?.city || "",
          state: doctorProfile?.hospital_address?.state || "",
          postal_code: doctorProfile?.hospital_address?.postal_code || "",
          country: doctorProfile?.hospital_address?.country || "",
        },
        specialties: doctorProfile?.specialties || [{ name: "" }],
        qualifications: doctorProfile?.qualifications || [
          { name: "", university: "" },
        ],
        languages: doctorProfile?.languages?.map((lang) => ({
          name: lang.name,
          level:
            lang.level as (typeof LanguageSchema.shape.level._def.values)[number],
        })),
        availability_start: doctorProfile?.availability_start || "",
        availability_end: doctorProfile?.availability_end || "",
      });
    };
    loadProfile();
  }, [user, fetchDoctorProfile]);

  // Reset form with default values when formDefaultValues changes
  useEffect(() => {
    form.reset(formDefaultValues);
  }, [formDefaultValues]);

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
    if (user.account_type !== "doctor") return;
    try {
      const formattedData = {
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          timezone: data.timezone,
          username: user.username,
        },
        specialties: data.specialties,
        languages: data.languages,
        qualifications: data.qualifications,
        hospital_address: data.hospital_address,
        experience: data.experience,
        cost: data.cost,
        currency: data.currency,
        description: data.description,
        availability: data.availability,
        phone: data.phone,
        profile_pic: data.profile_pic[0] ? data.profile_pic[0] : undefined,
      };
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

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        data-testid="doctor-profile-form"
      >
        <h1 className="py-8 text-3xl font-medium text-center">
          Edit your profile
        </h1>

        {/* Personal Information */}
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
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Picture */}
          <div className="flex items-end justify-center gap-3">
            {/* Image preview */}
            {doctorProfile?.profile_pic && (
              <Avatar className="object-cover w-16 h-16 rounded-full">
                <AvatarImage
                  src={previewUrl || doctorProfile?.profile_pic}
                  alt="Profile Preview"
                />
                <AvatarFallback>No Image</AvatarFallback>
              </Avatar>
            )}

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
        {/* Contact Information */}
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

        {/* Hospital address */}
        <h2 className="text-xl font-semibold">Hospital Address Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Address Fields */}
          <FormField
            control={form.control}
            name="hospital_address.street"
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
            name="hospital_address.city"
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
            name="hospital_address.state"
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
            name="hospital_address.postal_code"
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
            name="hospital_address.country"
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
        {/* Professional Information */}
        <h2 className="text-xl font-semibold">Professional Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input placeholder="experience (years)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Cost */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input placeholder="cost" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Currency */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="currency" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Availability */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
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
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="evenings">Evenings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Availability Start Time */}
          {/* Start from dropdown time 00:00 to 24:00 */}
          <FormField
            control={form.control}
            name="availability_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {createTimeArray().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Availability End Time */}
          <FormField
            control={form.control}
            name="availability_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {createTimeArray().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* Qualifications */}
        <h2 className="text-xl font-semibold">Qualifications</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            {qualificationFields.map((field, index) => (
              <div key={field.id} className="flex gap-6">
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`qualifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Qualification
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  key={field.id + "2"}
                  name={`qualifications.${index}.university`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        University
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

            <div className="flex flex-wrap gap-3 mt-2 sm:gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendQualification({ name: "", university: "" })
                }
              >
                Add Qualification
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  removeQualification(qualificationFields.length - 1)
                }
              >
                Remove Qualification
              </Button>
            </div>
          </div>
          <p className="text-destructive">
            {form.formState.errors.qualifications?.message}
          </p>
        </div>

        {/* Qualifications */}
        <h2 className="text-xl font-semibold">Specialties</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            {specialtyFields.map((field, index) => (
              <div key={field.id} className="flex gap-6">
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`specialties.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Specialties
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
            <div className="flex flex-wrap gap-3 mt-2 sm:gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSpecialty({ name: "" })}
              >
                Add Speciality
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSpecialty(specialtyFields.length - 1)}
              >
                Remove Speciality
              </Button>
            </div>
          </div>
          <p className="text-destructive">
            {form.formState.errors.specialties?.message}
          </p>
        </div>

        {/* Additional Personal Details */}
        <h2 className="text-xl font-semibold">Additional Details</h2>
        {/* Languages */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 sm:gap-6">
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
                        <Input {...field} data-testid={`language-input`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`languages.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Level
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LanguageSchema.shape.level._def.values.map(
                            (level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="flex flex-wrap gap-3 mt-2 sm:gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendLanguage({ name: "", level: "native" })}
              >
                Add Language
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
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

        {/* Update profile button */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
