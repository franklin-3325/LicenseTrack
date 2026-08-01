"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const LicenseSchema = z.object({
  licenseName: z.string().trim().min(1, { error: "Give this license a name." }),
  licenseNumber: z.string().trim().optional(),
  issuingAuthority: z.string().trim().optional(),
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

async function assertOwnsLicense(id: string, userId: string) {
  const license = await prisma.license.findUnique({ where: { id } });
  if (!license || license.userId !== userId) {
    throw new Error("License not found.");
  }
  return license;
}

export async function createLicense(
  _prevState: LicenseFormState,
  formData: FormData
): Promise<LicenseFormState> {
  const { userId } = await verifySession();

  const parsed = LicenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const expirationDate = toDateOrNull(parsed.data.expirationDate);
  if (!expirationDate) {
    return { error: "Enter a valid expiration date." };
  }

  await prisma.license.create({
    data: {
      userId,
      licenseName: parsed.data.licenseName,
      licenseNumber: parsed.data.licenseNumber || null,
      issuingAuthority: parsed.data.issuingAuthority || null,
      state: parsed.data.state || null,
      category: parsed.data.category || null,
      issueDate: toDateOrNull(parsed.data.issueDate),
      expirationDate,
      notes: parsed.data.notes || null,
    },
  });

  redirect("/dashboard");
}

export async function updateLicense(
  id: string,
  _prevState: LicenseFormState,
  formData: FormData
): Promise<LicenseFormState> {
  const { userId } = await verifySession();
  await assertOwnsLicense(id, userId);

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
  const { userId } = await verifySession();
  await assertOwnsLicense(id, userId);
  await prisma.license.delete({ where: { id } });
  revalidatePath("/dashboard");
}
