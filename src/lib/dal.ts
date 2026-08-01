import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export const verifySession = cache(async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }
  return { userId };
});

export const getCurrentUser = cache(async () => {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, companyName: true },
  });
});

// Every user belongs to exactly one organization (their own, or one they
// were invited into) - there's no org-switcher, so this is the org whose
// licenses and team they see.
export const verifyOrgSession = cache(async () => {
  const { userId } = await verifySession();

  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: { select: { id: true, name: true } } },
  });

  if (!membership) {
    redirect("/login");
  }

  return {
    userId,
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
    role: membership.role,
  };
});
