import { StarIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "@/components/ui/button";
import { DoctorProfile } from "@/types/user";

export default function Reviews({ doctor }: { doctor: DoctorProfile }) {
  return (
    <>
      <div className="">
        <dl>
          <div className="">
            <h4 className="text-xl font-bold">Telemedicine Practice History</h4>
            <div className="mt-4 space-y-4">
              {doctor.reviews.map((review, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <p className="font-bold">{review.patient_name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "text-primary" : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="text-sm">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </dl>
      </div>
      <div className="">
        <Button>Load More</Button>
      </div>
    </>
  );
}
