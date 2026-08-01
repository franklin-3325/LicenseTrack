"use client";

import { useActionState, useRef } from "react";
import { uploadLicenseDocument } from "@/app/actions/documents";

export default function DocumentUploadForm({
  licenseId,
}: {
  licenseId: string;
}) {
  const boundAction = uploadLicenseDocument.bind(null, licenseId);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="file"
        name="file"
        required
        className="block flex-1 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        {pending ? "Uploading..." : "Upload"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-700 sm:basis-full">{state.error}</p>
      )}
    </form>
  );
}
