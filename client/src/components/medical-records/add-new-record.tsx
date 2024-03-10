// Import necessary libraries
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
import { useMessagesStore } from "@/store/useMessageStore";

// Define Zod schema for form validation
const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  disorders: z
    .array(
      z.object({
        name: z.string().min(1, "Disorder name is required"),
        details: z.string().min(1, "Details are required"),
        first_noticed: z.string().optional(),
      }),
    )
    .optional(),
  medicines: z
    .array(
      z.object({
        name: z.string().min(1, "Medicine name is required"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
      }),
    )
    .optional(),
  diagnoses: z
    .array(
      z.object({
        name: z.string().min(1, "Diagnosis name is required"),
        details: z.string().min(1, "Details are required"),
        date: z.string().optional(),
      }),
    )
    .optional(),
});

type MedicalRecordFormSchema = z.infer<typeof medicalRecordSchema>;

export default function MedicalRecordForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalRecordFormSchema>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      // disorders: [{ name: "", details: "", first_noticed: "" }],
      // medicines: [{ name: "", dosage: "", start_date: "", end_date: "" }],
      // diagnoses: [{ name: "", details: "", date: "" }],
    },
  });

  const { selectedConversation } = useMessagesStore();

  const {
    fields: disorderFields,
    append: appendDisorder,
    remove: removeDisorder,
  } = useFieldArray({
    control,
    name: "disorders",
  });

  const {
    fields: medicineFields,
    append: appendMedicine,
    remove: removeMedicine,
  } = useFieldArray({
    control,
    name: "medicines",
  });

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control,
    name: "diagnoses",
  });

  const onSubmit = async (data: MedicalRecordFormSchema) => {
    console.log(data);
    console.log("test");
    // Submit data to your API
    try {
      const response = await axios.post("/api/medical-records", data);
      console.log(response.data);
      alert("Medical record added successfully!");
    } catch (error) {
      console.error("Failed to add medical record:", error);
      alert("Failed to add medical record.");
    }
  };

  if (!selectedConversation) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-md bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          Please select a conversation
        </h2>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-md rounded-md bg-white p-4 shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold">Add New Medical Record</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Disorders</h3>
          {disorderFields.map((item, index) => (
            <div key={item.id} className="mb-4 flex flex-col gap-3">
              <Input
                {...register(`disorders.${index}.name`)}
                placeholder="Disorder Name"
              />
              <Textarea
                {...register(`disorders.${index}.details`)}
                placeholder="Details"
              />
              <Input
                type="text"
                {...register(`disorders.${index}.first_noticed`)}
                placeholder="First Noticed"
                onFocus={(e) => (e.target.type = "date")}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => removeDisorder(index)}
                  variant={"destructive"}
                  className="w-fit"
                >
                  Remove
                </Button>
                {index === disorderFields.length - 1 && (
                  <Button
                    type="button"
                    onClick={() =>
                      appendDisorder({
                        name: "",
                        details: "",
                        first_noticed: "",
                      })
                    }
                  >
                    Add Disorder
                  </Button>
                )}
              </div>
            </div>
          ))}
          {disorderFields.length === 0 && (
            <Button
              type="button"
              onClick={() =>
                appendDisorder({ name: "", details: "", first_noticed: "" })
              }
            >
              Add Disorder
            </Button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Medicines</h3>
          {medicineFields.map((item, index) => (
            <div key={item.id} className="mb-4 flex flex-col gap-3">
              <Input
                {...register(`medicines.${index}.name`)}
                placeholder="Medicine Name"
              />
              <Input
                {...register(`medicines.${index}.dosage`)}
                placeholder="Dosage"
              />
              <Input
                type="text"
                {...register(`medicines.${index}.start_date`)}
                placeholder="Start Date"
                onFocus={(e) => (e.target.type = "date")}
              />
              <Input
                type="text"
                {...register(`medicines.${index}.end_date`)}
                placeholder="End Date"
                onFocus={(e) => (e.target.type = "date")}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  variant={"destructive"}
                  className="w-fit"
                >
                  Remove
                </Button>
                {index === removeMedicine.length - 1 && (
                  <Button
                    type="button"
                    onClick={() =>
                      appendMedicine({
                        name: "",
                        dosage: "",
                        start_date: "",
                        end_date: "",
                      })
                    }
                  >
                    Add Medicine
                  </Button>
                )}
              </div>
            </div>
          ))}

          {medicineFields.length === 0 && (
            <Button
              type="button"
              onClick={() =>
                appendMedicine({
                  name: "",
                  dosage: "",
                  start_date: "",
                  end_date: "",
                })
              }
            >
              Add Disorder
            </Button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Diagnoses</h3>
          {diagnosisFields.map((item, index) => (
            <div key={item.id} className="mb-4 flex flex-col gap-3">
              <Input
                {...register(`diagnoses.${index}.name`)}
                placeholder="Diagnosis Name"
              />
              <Textarea
                {...register(`diagnoses.${index}.details`)}
                placeholder="Details"
              />
              <Input
                type="text"
                {...register(`diagnoses.${index}.date`)}
                placeholder="Date"
                onFocus={(e) => (e.target.type = "date")}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  variant={"destructive"}
                  className="w-fit"
                >
                  Remove
                </Button>
                {index === diagnosisFields.length - 1 && (
                  <Button
                    type="button"
                    onClick={() =>
                      appendDiagnosis({ name: "", details: "", date: "" })
                    }
                  >
                    Add Diagnosis
                  </Button>
                )}
              </div>
            </div>
          ))}

          {diagnosisFields.length === 0 && (
            <Button
              type="button"
              onClick={() =>
                appendDiagnosis({ name: "", details: "", date: "" })
              }
            >
              Add Diagnosis
            </Button>
          )}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
