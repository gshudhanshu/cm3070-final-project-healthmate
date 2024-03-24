"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "An error occurred. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex h-[40rem] max-h-screen items-center justify-center">
      <h2 className="mb-4 text-2xl">{message}</h2>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
};

export default ErrorComponent;
