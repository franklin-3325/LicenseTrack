import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRenewalReminderEmail } from "@/lib/mailer";
import { daysUntil } from "@/lib/licenseStatus";

// Triggered on a schedule (e.g. a daily Vercel Cron job) to email users
// whose licenses are about to expire. See README.md for setup.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);

  const dueLicenses = await prisma.license.findMany({
    where: {
      expirationDate: { lte: in30Days },
      last30DayReminder: null,
    },
    include: {
      organization: {
        include: { memberships: { include: { user: { select: { email: true } } } } },
      },
    },
  });

  let sent = 0;
  for (const license of dueLicenses) {
    const daysLeft = daysUntil(license.expirationDate);
    for (const membership of license.organization.memberships) {
      await sendRenewalReminderEmail({
        to: membership.user.email,
        licenseName: license.licenseName,
        expirationDate: license.expirationDate,
        daysLeft,
      });
    }
    await prisma.license.update({
      where: { id: license.id },
      data: { last30DayReminder: new Date() },
    });
    sent++;
  }

  return NextResponse.json({ checked: dueLicenses.length, sent });
}
