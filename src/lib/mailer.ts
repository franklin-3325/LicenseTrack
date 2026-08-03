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

type LeadNotification = {
  name: string;
  email: string;
  companyName: string;
  interest: string | null;
  employeeCount: string | null;
  states: string | null;
  trades: string | null;
  message: string | null;
};

export async function sendLeadNotificationEmail(lead: LeadNotification) {
  const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL;
  const subject = `New lead: ${lead.companyName}`;
  const body = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.companyName}`,
    lead.interest && `Interested in: ${lead.interest}`,
    lead.employeeCount && `Employees: ${lead.employeeCount}`,
    lead.states && `States: ${lead.states}`,
    lead.trades && `Trades: ${lead.trades}`,
    lead.message && `Message: ${lead.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const resend = getResendClient();
  if (!resend || !notifyTo) {
    console.log(
      `[mailer] Lead notification not sent (missing RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL).\n${subject}\n${body}`
    );
    return { sent: false, reason: "not-configured" as const };
  }

  await resend.emails.send({
    from: FROM,
    to: notifyTo,
    replyTo: lead.email,
    subject,
    html: `<pre style="font-family: inherit; white-space: pre-wrap;">${body}</pre>`,
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
