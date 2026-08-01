"use client";

import { deleteLicenseDocument } from "@/app/actions/documents";

export default function DeleteDocumentButton({
  documentId,
  licenseId,
}: {
  documentId: string;
  licenseId: string;
}) {
  return (
    <form action={deleteLicenseDocument.bind(null, documentId, licenseId)}>
      <button
        type="submit"
        className="text-xs text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </form>
  );
}
