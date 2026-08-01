import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  const invitation = invite
    ? await prisma.invitation.findUnique({ where: { token: invite } })
    : null;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-gray-900">
        {invitation ? "Join your team" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={invite ? `/login?invite=${invite}` : "/login"}
          className="font-medium text-gray-900 underline"
        >
          Log in
        </Link>
      </p>
      <div className="mt-6">
        <SignupForm
          inviteToken={invitation?.acceptedAt ? undefined : invitation?.token}
          defaultEmail={invitation?.acceptedAt ? undefined : invitation?.email}
        />
      </div>
    </div>
  );
}
