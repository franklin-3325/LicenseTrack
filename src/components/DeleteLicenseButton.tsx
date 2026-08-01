"use client";

import { deleteLicense } from "@/app/actions/licenses";

export default function DeleteLicenseButton({ id }: { id: string }) {
  return (
    <form
      action={deleteLicense.bind(null, id)}
      onSubmit={(event) => {
        if (!confirm("Delete this license? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </form>
  );
}
