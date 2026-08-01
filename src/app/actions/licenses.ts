"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyOrgSession } from "@/lib/dal";

const LicenseSchema = z.object({
  licenseName: z.string().trim().min(1, { error: "Give this license a name." }),
  licenseNumber: z.string().trim().optional(),
  issuingAuthority: z.string().trim().optional(),
  holderName: z.string().trim().optional(),
  state: z.string().trim().optional(),
  category: z.string().trim().optional(),
  issueDate: z.string().trim().optional(),
  expirationDate: z
    .string()
    .trim()
    .min(1, { error: "Set an expiration date." }),
  notes: z.string().trim().optional(),
});

export type LicenseFormState = {
  error?: string;
} | undefined;

function toDateOrNull(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function assertLicenseInOrg(id: string, organizationId: string) {
  const license = await prisma.license.findUnique({ where: { id } });
  if (!license || license.organizationId !== organizationId) {
    throw new Error("License not found.");
  }
  return license;
}

export async function createLicense(
  _prevState: LicenseFormState,
  formData: FormData
): Promise<LicenseFormState> {
  const { organizationId } = await verifyOrgSession();

  const parsed = LicenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const expirationDate = toDateOrNull(parsed.data.expirationDate);
  if (!expirationDate) {
    return { error: "Enter a valid expiration date." };
  }

  const license = await prisma.license.create({
    data: {
      organizationId,
      licenseName: parsed.data.licenseName,
      licenseNumber: parsed.data.licenseNumber || null,
      issuingAuthority: parsed.data.issuingAuthority || null,
      holderName: parsed.data.holderName || null,
      state: parsed.data.state || null,
      category: parsed.data.category || null,
      issueDate: toDateOrNull(parsed.data.issueDate),
      expirationDate,
      notes: parsed.data.notes || null,
    },
  });

  // Land on the edit page so they can immediately attach the license
  // document, insurance cert, etc.
  redirect(`/licenses/${license.id}/edit`);
}

export async function updateLicense(
  id: string,
  _prevState: LicenseFormState,
  formData: FormData
): Promise<LicenseFormState> {
  const { organizationId } = await verifyOrgSession();
  await assertLicenseInOrg(id, organizationId);

  const parsed = LicenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const expirationDate = toDateOrNull(parsed.data.expirationDate);
  if (!expirationDate) {
    return { error: "Enter a valid expiration date." };
  }

  await prisma.license.update({
    where: { id },
    data: {
      licenseName: parsed.data.licenseName,
      licenseNumber: parsed.data.licenseNumber || null,
      issuingAuthority: parsed.data.issuingAuthority || null,
      holderName: parsed.data.holderName || null,
      state: parsed.data.state || null,
      category: parsed.data.category || null,
      issueDate: toDateOrNull(parsed.data.issueDate),
      expirationDate,
      notes: parsed.data.notes || null,
    },
  });

  redirect("/dashboard");
}

export async function deleteLicense(id: string) {
  const { organizationId } = await verifyOrgSession();
  await assertLicenseInOrg(id, organizationId);
  await prisma.license.delete({ where: { id } });
  revalidatePath("/dashboard");
}
