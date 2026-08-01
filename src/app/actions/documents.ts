"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyOrgSession } from "@/lib/dal";

export type DocumentFormState = {
  error?: string;
} | undefined;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function assertLicenseInOrg(licenseId: string, organizationId: string) {
  const license = await prisma.license.findUnique({
    where: { id: licenseId },
  });
  if (!license || license.organizationId !== organizationId) {
    throw new Error("License not found.");
  }
  return license;
}

export async function uploadLicenseDocument(
  licenseId: string,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const { organizationId } = await verifyOrgSession();
  await assertLicenseInOrg(licenseId, organizationId);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Files must be smaller than 10MB." };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      error:
        "File storage isn't set up yet for this deployment (missing Vercel Blob). Ask whoever manages the site to add it.",
    };
  }

  try {
    const blob = await put(`licenses/${licenseId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    await prisma.licenseDocument.create({
      data: {
        licenseId,
        fileName: file.name,
        url: blob.url,
        contentType: file.type || null,
        size: file.size,
      },
    });
  } catch {
    return { error: "Upload failed. Please try again." };
  }

  revalidatePath(`/licenses/${licenseId}/edit`);
  return undefined;
}

export async function deleteLicenseDocument(
  documentId: string,
  licenseId: string
) {
  const { organizationId } = await verifyOrgSession();
  await assertLicenseInOrg(licenseId, organizationId);

  const document = await prisma.licenseDocument.findUnique({
    where: { id: documentId },
  });
  if (!document || document.licenseId !== licenseId) {
    throw new Error("Document not found.");
  }

  try {
    await del(document.url);
  } catch {
    // If the blob is already gone, still clean up our record.
  }

  await prisma.licenseDocument.delete({ where: { id: documentId } });
  revalidatePath(`/licenses/${licenseId}/edit`);
}
