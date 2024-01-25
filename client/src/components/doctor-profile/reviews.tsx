import { StarIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function Reviews({ doctor }: { doctor: any }) {
  const reviews = [
    {
      name: "Rahul G.",
      date: "Nov 10, 2023",
      rating: 5,
      comment: "Lorem ipsum dolor sit amet...",
    },
    // More reviews...
  ];

  return (
    <>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <h4 className="text-sm font-medium text-gray-500">
              Telemedicine Practice History
            </h4>
            <div className="mt-4 space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="flex items-center space-x-4">
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
                  <div className="text-sm text-gray-600">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </dl>
      </div>
      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Load More
        </button>
      </div>
    </>
  );
}
