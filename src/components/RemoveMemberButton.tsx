"use client";

import { removeMember } from "@/app/actions/team";

export default function RemoveMemberButton({
  membershipId,
}: {
  membershipId: string;
}) {
  return (
    <form
      action={removeMember.bind(null, membershipId)}
      onSubmit={(event) => {
        if (!confirm("Remove this person from your team?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </form>
  );
}
