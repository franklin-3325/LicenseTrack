"use client";

import { useActionState } from "react";
import { inviteMember } from "@/app/actions/team";

export default function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteMember, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="teammate@company.com"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Inviting..." : "Send invite"}
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.inviteUrl && (
        <div className="mt-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          <p>
            Invite created. If they don&apos;t get the email, share this link
            directly:
          </p>
          <code className="mt-1 block break-all text-xs">
            {state.inviteUrl}
          </code>
        </div>
      )}
    </div>
  );
}
