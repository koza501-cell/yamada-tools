"use client";
import React, { type ReactNode } from "react";
import { FormLabel } from "./FormLabel";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ id, label, required, optional, helper, error, children }: FieldProps) {
  const describedBy = [
    error ? `${id}-error` : null,
    !error && helper ? `${id}-helper` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div>
      <FormLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FormLabel>
      {child}
      {!error && helper && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-gray-500">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
