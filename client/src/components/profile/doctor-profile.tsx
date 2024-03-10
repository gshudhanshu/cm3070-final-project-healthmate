"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
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

const SpecialitySchema = z.object({
  name: z.string(),
});

const LanguageSchema = z.object({
  name: z.string(),
});

const QualificationSchema = z.object({
  name: z.string(),
  university: z.string(),
});

const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  timezone: z.string(),
  phone: z.string().optional(),
  hospital_address: AddressSchema,
  specialties: z.array(SpecialitySchema),
  qualifications: z.array(QualificationSchema),
  experience: z
    .number()
    .min(0, "Experience must be a positive number")
    .optional(),
  languages: z.array(LanguageSchema).optional(),
  cost: z.number().min(0, "Cost must be a positive number"),
  currency: z.string().max(3, "Currency code must be 3 characters"),
  description: z.string(),
  availability: z.enum(["full-time", "part-time", "weekends", "evenings"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function DoctorProfileForm() {
  const { updateUserProfile, fetchDoctorProfile, doctorProfile } =
    useUserProfileStore();
  const { user } = useAuthStore();

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
    languages: [{ name: "" }],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const {
    fields: specialtyFields,
    append: appendSpecialty,
    remove: removeSpecialty,
  } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control: form.control,
    name: "qualifications",
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

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      await fetchDoctorProfile(user?.username);
      // Ensure doctorProfile data is available here
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
        languages: doctorProfile?.languages || [{ name: "" }],
      });
    };
    loadProfile();
  }, [user, fetchDoctorProfile]);

  useEffect(() => {
    form.reset(formDefaultValues);
  }, [formDefaultValues]);

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
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
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

          {/* Qualifications */}
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
            <div className="flex gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
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
                className="mt-2"
                onClick={() =>
                  removeQualification(qualificationFields.length - 1)
                }
              >
                Remove Qualification
              </Button>
            </div>
          </div>
          {/* Speciality */}
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
            <div className="flex gap-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendSpecialty({ name: "" })}
              >
                Add Speciality
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => removeSpecialty(specialtyFields.length - 1)}
              >
                Remove Speciality
              </Button>
            </div>
          </div>
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
