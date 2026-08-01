import "server-only";
import { Resend } from "resend";

const FROM =
  process.env.EMAIL_FROM || "LicenseTrack <onboarding@resend.dev>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

type ReminderEmail = {
  to: string;
  licenseName: string;
  expirationDate: Date;
  daysLeft: number;
};

export async function sendRenewalReminderEmail({
  to,
  licenseName,
  expirationDate,
  daysLeft,
}: ReminderEmail) {
  const formattedDate = expirationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const subject = `"${licenseName}" expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;

  const resend = getResendClient();
  if (!resend) {
    console.log(
      `[mailer] RESEND_API_KEY not set - skipping real send. Would have emailed ${to}: ${subject}`
    );
    return { sent: false, reason: "no-api-key" as const };
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <p>Hi,</p>
      <p>Your license <strong>${licenseName}</strong> expires on <strong>${formattedDate}</strong> (${daysLeft} day${daysLeft === 1 ? "" : "s"} from now).</p>
      <p>Log in to LicenseTrack to review the details or mark it as renewed.</p>
    `,
  });

  return { sent: true as const };
}

type TeamInviteEmail = {
  to: string;
  organizationName: string;
  inviteUrl: string;
};

export async function sendTeamInviteEmail({
  to,
  organizationName,
  inviteUrl,
}: TeamInviteEmail) {
  const subject = `You've been invited to join ${organizationName} on LicenseTrack`;

  const resend = getResendClient();
  if (!resend) {
    console.log(
      `[mailer] RESEND_API_KEY not set - skipping real send. Would have emailed ${to}: ${subject} (${inviteUrl})`
    );
    return { sent: false, reason: "no-api-key" as const };
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <p>Hi,</p>
      <p><strong>${organizationName}</strong> has invited you to join their team on LicenseTrack, so you can see and manage their contractor licenses together.</p>
      <p><a href="${inviteUrl}">Accept the invite</a></p>
    `,
  });

  return { sent: true as const };
}
