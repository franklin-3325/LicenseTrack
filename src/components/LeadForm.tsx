"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions/leads";

export default function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, undefined);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-900">Got it - thank you.</p>
        <p className="mt-1 text-sm text-green-800">
          We&apos;ll reach out shortly to walk through what we found and how
          we can help.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700">
            Your name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-company" className="block text-sm font-medium text-gray-700">
          Company name
        </label>
        <input
          id="lead-company"
          name="companyName"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-employees" className="block text-sm font-medium text-gray-700">
            How many licensed people? <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="lead-employees"
            name="employeeCount"
            defaultValue=""
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Select one</option>
            <option value="1">Just me</option>
            <option value="2-5">2-5</option>
            <option value="6-20">6-20</option>
            <option value="21-50">21-50</option>
            <option value="50+">50+</option>
          </select>
        </div>
        <div>
          <label htmlFor="lead-states" className="block text-sm font-medium text-gray-700">
            States you&apos;re licensed in <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="lead-states"
            name="states"
            type="text"
            placeholder="e.g. CA, NV, AZ"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-trades" className="block text-sm font-medium text-gray-700">
          Trade(s) <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="lead-trades"
          name="trades"
          type="text"
          placeholder="e.g. Electrical, HVAC, General Contractor"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="lead-message" className="block text-sm font-medium text-gray-700">
          Anything specific going on? <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={3}
          placeholder="e.g. a renewal or CE deadline we're worried about, a qualifier issue, a bid coming up"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Sending..." : "Get my free compliance review"}
      </button>
      <p className="text-center text-xs text-gray-500">
        No cost, no obligation. We&apos;ll tell you exactly where you stand.
      </p>
    </form>
  );
}
