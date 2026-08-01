"use client";

import { useActionState } from "react";
import type { LicenseFormState } from "@/app/actions/licenses";

type LicenseDefaults = {
  licenseName?: string;
  licenseNumber?: string | null;
  issuingAuthority?: string | null;
  state?: string | null;
  category?: string | null;
  issueDate?: string | null;
  expirationDate?: string | null;
  notes?: string | null;
};

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default function LicenseForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    state: LicenseFormState,
    formData: FormData
  ) => Promise<LicenseFormState>;
  defaultValues?: LicenseDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="licenseName" className="block text-sm font-medium text-gray-700">
          License name
        </label>
        <input
          id="licenseName"
          name="licenseName"
          type="text"
          required
          placeholder="e.g. General Contractor License"
          defaultValue={defaultValues?.licenseName}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
            License number
          </label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            defaultValue={defaultValues?.licenseNumber ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="issuingAuthority" className="block text-sm font-medium text-gray-700">
            Issuing authority
          </label>
          <input
            id="issuingAuthority"
            name="issuingAuthority"
            type="text"
            placeholder="e.g. State Licensing Board"
            defaultValue={defaultValues?.issuingAuthority ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="e.g. CA"
            defaultValue={defaultValues?.state ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Electrical"
            defaultValue={defaultValues?.category ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
            Issue date <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="issueDate"
            name="issueDate"
            type="date"
            defaultValue={toDateInputValue(defaultValues?.issueDate)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
            Expiration date
          </label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            required
            defaultValue={toDateInputValue(defaultValues?.expirationDate)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
