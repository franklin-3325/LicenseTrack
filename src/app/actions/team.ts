"use server";

import * as z from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyOrgSession } from "@/lib/dal";
import { createSession, getSessionUserId } from "@/lib/session";
import { sendTeamInviteEmail } from "@/lib/mailer";

const InviteSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
});

export type InviteFormState = {
  error?: string;
  inviteUrl?: string;
} | undefined;

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function inviteMember(
  _prevState: InviteFormState,
  formData: FormData
): Promise<InviteFormState> {
  const { userId, organizationId, organizationName, role } =
    await verifyOrgSession();

  if (role !== "OWNER") {
    return { error: "Only the team owner can invite people." };
  }

  const parsed = InviteSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email } = parsed.data;

  const existingMember = await prisma.membership.findFirst({
    where: { organizationId, user: { email } },
  });
  if (existingMember) {
    return { error: "That person is already on your team." };
  }

  const invitation = await prisma.invitation.create({
    data: { organizationId, email, invitedById: userId },
  });

  const inviteUrl = `${await getBaseUrl()}/invite/${invitation.token}`;

  await sendTeamInviteEmail({
    to: email,
    organizationName,
    inviteUrl,
  });

  revalidatePath("/team");
  return { inviteUrl };
}

export async function removeMember(membershipId: string) {
  const { organizationId, role } = await verifyOrgSession();

  if (role !== "OWNER") {
    throw new Error("Only the team owner can remove people.");
  }

  const target = await prisma.membership.findUnique({
    where: { id: membershipId },
  });
  if (!target || target.organizationId !== organizationId) {
    throw new Error("Team member not found.");
  }
  if (target.role === "OWNER") {
    throw new Error("The team owner can't be removed.");
  }

  await prisma.membership.delete({ where: { id: membershipId } });
  revalidatePath("/team");
}

export async function acceptInvite(token: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect(`/login?invite=${token}`);
  }

  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation || invitation.acceptedAt) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    redirect("/dashboard");
  }

  const alreadyMember = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: invitation.organizationId,
      },
    },
  });

  if (!alreadyMember) {
    await prisma.$transaction([
      prisma.membership.create({
        data: { userId, organizationId: invitation.organizationId, role: "MEMBER" },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      }),
    ]);
  }

  await createSession(userId);
  redirect("/dashboard");
}
