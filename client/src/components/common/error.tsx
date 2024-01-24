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
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="mb-4">{message}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
};

export default ErrorComponent;
