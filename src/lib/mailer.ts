import "server-only";
import { Resend } from "resend";

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
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "LicenseTrack <onboarding@resend.dev>";
  const formattedDate = expirationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const subject = `"${licenseName}" expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;

  if (!apiKey) {
    console.log(
      `[mailer] RESEND_API_KEY not set - skipping real send. Would have emailed ${to}: ${subject}`
    );
    return { sent: false, reason: "no-api-key" as const };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
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
