import { StarIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorProfile } from "@/types/user";
import dayjs, { Dayjs } from "dayjs";
import LoadingComponent from "@/components/common/loading";
import ErrorComponent from "@/components/common/error";

import { useReviewStore } from "@/store/useReviewStore";

export default function ReviewsSection({ doctor }: { doctor: DoctorProfile }) {
  const { fetchReviews, isLoading, error, reviews, page } = useReviewStore();

  // Call fetchReviews initially to load the first page
  useEffect(() => {
    if (doctor.user.username && page === 1 && reviews?.length === 0) {
      fetchReviews(doctor.user.username);
    }
  }, []);

  // Handler for the Load More button
  const handleLoadMore = () => {
    if (doctor.user.username) {
      fetchReviews(doctor.user.username);
    }
  };

  // Display loading component while fetching reviews
  if (isLoading) return <LoadingComponent />;

  // Display error component if there is an error fetching reviews
  if (error) return <ErrorComponent />;

  return reviews ? (
    <>
      <div className="">
        <dl>
          <div className="">
            <h4 className="text-xl font-bold">Telemedicine Practice History</h4>
            <div className="mt-4 space-y-4">
              {/* Render the reviews from an array */}
              {reviews.map((review, index) => (
                <div key={index} className="flex flex-col items-start ">
                  <p className="font-bold">{review.patient_name}</p>
                  <div className="flex items-start">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "text-primary" : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="mx-2 text-sm"> | </span>
                    <span>
                      {dayjs(review.date_created).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </dl>
      </div>
      <div>
        <Button
          onClick={() => {
            fetchReviews(doctor.user.username);
          }}
        >
          Load More
        </Button>
      </div>
    </>
  ) : (
    <div>error.message</div>
  );
}
