"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const SignupSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter your name." }),
  companyName: z.string().trim().nullish(),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
  inviteToken: z.string().trim().nullish(),
});

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
  inviteToken: z.string().trim().nullish(),
});

export type AuthFormState = {
  error?: string;
} | undefined;

// If there's a valid, unaccepted invitation matching this email, join that
// organization as a member. Otherwise create a brand new organization and
// make this user its owner.
async function joinOrCreateOrganization(
  userId: string,
  email: string,
  companyName: string | null | undefined,
  name: string,
  inviteToken: string | null | undefined
) {
  if (inviteToken) {
    const invitation = await prisma.invitation.findUnique({
      where: { token: inviteToken },
    });

    if (
      invitation &&
      !invitation.acceptedAt &&
      invitation.email.toLowerCase() === email.toLowerCase()
    ) {
      await prisma.$transaction([
        prisma.membership.create({
          data: {
            userId,
            organizationId: invitation.organizationId,
            role: "MEMBER",
          },
        }),
        prisma.invitation.update({
          where: { id: invitation.id },
          data: { acceptedAt: new Date() },
        }),
      ]);
      return;
    }
  }

  await prisma.organization.create({
    data: {
      name: companyName || `${name}'s Team`,
      memberships: {
        create: { userId, role: "OWNER" },
      },
    },
  });
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteToken: formData.get("inviteToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { name, companyName, email, password, inviteToken } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      companyName: companyName || null,
      email,
      passwordHash,
    },
  });

  await joinOrCreateOrganization(user.id, email, companyName, name, inviteToken);

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    inviteToken: formData.get("inviteToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password, inviteToken } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Incorrect email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Incorrect email or password." };
  }

  if (inviteToken) {
    const invitation = await prisma.invitation.findUnique({
      where: { token: inviteToken },
    });
    if (
      invitation &&
      !invitation.acceptedAt &&
      invitation.email.toLowerCase() === email.toLowerCase()
    ) {
      const alreadyMember = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: invitation.organizationId,
          },
        },
      });
      if (!alreadyMember) {
        await prisma.$transaction([
          prisma.membership.create({
            data: {
              userId: user.id,
              organizationId: invitation.organizationId,
              role: "MEMBER",
            },
          }),
          prisma.invitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() },
          }),
        ]);
      }
    }
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
