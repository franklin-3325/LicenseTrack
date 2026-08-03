"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions/leads";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-steel focus:outline-none focus:ring-1 focus:ring-steel";
const labelClass = "block text-sm font-medium text-gray-700";

export default function LeadForm({
  defaultInterest,
}: {
  defaultInterest?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLead, undefined);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-brand-green/30 bg-brand-green/10 p-6 text-center">
        <p className="font-medium text-navy">Got it - thank you.</p>
        <p className="mt-1 text-sm text-slate">
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
          <label htmlFor="lead-name" className={labelClass}>
            Your name
          </label>
          <input id="lead-name" name="name" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelClass}>
            Email
          </label>
          <input id="lead-email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="lead-company" className={labelClass}>
          Company name
        </label>
        <input id="lead-company" name="companyName" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="lead-interest" className={labelClass}>
          What are you interested in?
        </label>
        <select
          id="lead-interest"
          name="interest"
          defaultValue={defaultInterest ?? ""}
          className={`${inputClass} bg-white`}
        >
          <option value="">Not sure yet</option>
          <option value="License management">
            License, bond, insurance &amp; CE management
          </option>
          <option value="Workforce licensing">
            Workforce licensing - get more of my crew licensed
          </option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-employees" className={labelClass}>
            How many licensed people? <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="lead-employees"
            name="employeeCount"
            defaultValue=""
            className={`${inputClass} bg-white`}
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
          <label htmlFor="lead-states" className={labelClass}>
            States you&apos;re licensed in <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="lead-states"
            name="states"
            type="text"
            placeholder="e.g. CA, NV, AZ"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-trades" className={labelClass}>
          Trade(s) <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="lead-trades"
          name="trades"
          type="text"
          placeholder="e.g. Electrical, HVAC, General Contractor"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="lead-message" className={labelClass}>
          Anything specific going on? <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={3}
          placeholder="e.g. a renewal or CE deadline we're worried about, a qualifier issue, a bid coming up"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-steel px-4 py-3 text-sm font-medium text-white hover:bg-steel-dark disabled:opacity-50"
      >
        {pending ? "Sending..." : "Get my free snapshot"}
      </button>
      <p className="text-center text-xs text-gray-500">
        No cost, no obligation. We&apos;ll tell you exactly where you stand.
      </p>
    </form>
  );
}
