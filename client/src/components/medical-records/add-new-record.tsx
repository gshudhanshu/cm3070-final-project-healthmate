// Import necessary libraries
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ErrorComponent from "@/components/common/error";

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
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { toast } from "../ui/use-toast";

// Define Zod schema for form validation
const medicalRecordSchema = z.object({
  patient_id: z.number(),
  disorders: z
    .array(
      z.object({
        name: z.string().min(1, "Disorder name is required"),
        details: z.string().min(1, "Details are required"),
        first_noticed: z.string(),
      }),
    )
    .optional(),
  medicines: z
    .array(
      z.object({
        name: z.string().min(1, "Medicine name is required"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.string(),
        end_date: z.string(),
      }),
    )
    .optional(),
  diagnoses: z
    .array(
      z.object({
        name: z.string().min(1, "Diagnosis name is required"),
        details: z.string().min(1, "Details are required"),
        date: z.string(),
      }),
    )
    .optional(),
});

type MedicalRecordFormSchema = z.infer<typeof medicalRecordSchema>;

export default function MedicalRecordForm() {
  const { selectedConversation } = useMessagesStore();
  const { addMedicalRecord } = useMedicalRecordsStore();

  const { control, register, handleSubmit, formState } =
    useForm<MedicalRecordFormSchema>({
      resolver: zodResolver(medicalRecordSchema),
      defaultValues: {
        patient_id: selectedConversation?.patient?.id,
        // disorders: [{ name: "", details: "", first_noticed: "" }],
        // medicines: [{ name: "", dosage: "", start_date: "", end_date: "" }],
        // diagnoses: [{ name: "", details: "", date: "" }],
      },
    });

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
    if (
      data.disorders?.length === 0 &&
      data.medicines?.length === 0 &&
      data.diagnoses?.length === 0
    ) {
      toast({
        title: "No data to submit",
        description: "Please add at least one disorder, medicine or diagnosis",
        variant: "destructive",
      });
      return;
    }
    addMedicalRecord(data);
  };

  if (!selectedConversation) {
    return <ErrorComponent message="Please select a conversation" />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-3 mt-8 rounded-md bg-white p-4 shadow-md md:ml-0 md:mr-6 dark:bg-slate-800"
    >
      <h2 className="mb-4 text-xl font-semibold">Add New Medical Record</h2>
      <Input
        {...register("patient_id")}
        placeholder="Patient id"
        value={selectedConversation.patient?.id || ""}
        disabled
      />
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Disorders</h3>
        {disorderFields.map((item, index) => (
          <div key={item.id} className="mb-4 flex flex-col gap-3">
            <Input
              {...register(`disorders.${index}.name`)}
              placeholder="Disorder Name"
            />
            <div className="text-destructive">
              {formState.errors.disorders?.[index]?.name?.message}
            </div>
            <Textarea
              {...register(`disorders.${index}.details`)}
              placeholder="Details"
            />
            <div className="text-destructive">
              {formState.errors.disorders?.[index]?.details?.message}
            </div>
            <Input
              type="text"
              {...register(`disorders.${index}.first_noticed`)}
              placeholder="First Noticed"
              onFocus={(e) => (e.target.type = "date")}
            />
            <div className="text-destructive">
              {formState.errors.disorders?.[index]?.first_noticed?.message}
            </div>
            <div className="flex items-center gap-2">
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
              <Button
                type="button"
                onClick={() => removeDisorder(index)}
                variant={"destructive"}
                className="w-fit"
              >
                Remove
              </Button>
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
            <div className="text-destructive">
              {formState.errors.medicines?.[index]?.name?.message}
            </div>
            <Input
              {...register(`medicines.${index}.dosage`)}
              placeholder="Dosage"
            />
            <div className="text-destructive">
              {formState.errors.medicines?.[index]?.dosage?.message}
            </div>
            <Input
              type="text"
              {...register(`medicines.${index}.start_date`)}
              placeholder="Start Date"
              onFocus={(e) => (e.target.type = "date")}
            />
            <div className="text-destructive">
              {formState.errors.medicines?.[index]?.start_date?.message}
            </div>
            <Input
              type="text"
              {...register(`medicines.${index}.end_date`)}
              placeholder="End Date"
              onFocus={(e) => (e.target.type = "date")}
            />
            <div className="text-destructive">
              {formState.errors.medicines?.[index]?.end_date?.message}
            </div>

            <div className="flex items-center gap-2">
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
              <Button
                type="button"
                onClick={() => removeMedicine(index)}
                variant={"destructive"}
                className="w-fit"
              >
                Remove
              </Button>
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
            <div className="text-destructive">
              {formState.errors.diagnoses?.[index]?.name?.message}
            </div>
            <Textarea
              {...register(`diagnoses.${index}.details`)}
              placeholder="Details"
            />
            <div className="text-destructive">
              {formState.errors.diagnoses?.[index]?.details?.message}
            </div>
            <Input
              type="text"
              {...register(`diagnoses.${index}.date`)}
              placeholder="Date"
              onFocus={(e) => (e.target.type = "date")}
            />
            <div className="text-destructive">
              {formState.errors.diagnoses?.[index]?.date?.message}
            </div>

            <div className="flex items-center gap-2">
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
              <Button
                type="button"
                onClick={() => removeDiagnosis(index)}
                variant={"destructive"}
                className="w-fit"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        {diagnosisFields.length === 0 && (
          <Button
            type="button"
            onClick={() => appendDiagnosis({ name: "", details: "", date: "" })}
          >
            Add Diagnosis
          </Button>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
