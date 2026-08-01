"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { sendLeadNotificationEmail } from "@/lib/mailer";

const LeadSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter your name." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  companyName: z.string().trim().min(1, { error: "Enter your company name." }),
  employeeCount: z.string().trim().optional(),
  states: z.string().trim().optional(),
  trades: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export type LeadFormState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = LeadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const lead = await prisma.lead.create({ data: parsed.data });

  await sendLeadNotificationEmail({
    name: lead.name,
    email: lead.email,
    companyName: lead.companyName,
    employeeCount: lead.employeeCount,
    states: lead.states,
    trades: lead.trades,
    message: lead.message,
  });

  return { success: true };
}
