import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { acceptInvite } from "@/app/actions/team";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { name: true } } },
  });

  if (!invitation || invitation.acceptedAt) {
    return (
      <Message title="This invite isn't valid">
        It may have already been used, or the link is incorrect.
      </Message>
    );
  }

  const userId = await getSessionUserId();
  const currentUser = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  if (currentUser) {
    if (currentUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return (
        <Message title="Wrong account">
          This invite was sent to <strong>{invitation.email}</strong>, but
          you&apos;re signed in as {currentUser.email}. Log out and try the
          link again to accept it.
        </Message>
      );
    }

    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Join {invitation.organization.name}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          You&apos;ll be able to see and manage every license on this team.
        </p>
        <form action={acceptInvite.bind(null, token)} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Accept invite
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Join {invitation.organization.name}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Create an account or log in with <strong>{invitation.email}</strong>{" "}
        to accept this invite.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href={`/signup?invite=${token}`}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Create account
        </Link>
        <Link
          href={`/login?invite=${token}`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
}

function Message({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">{children}</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-gray-900 underline"
      >
        Go to LicenseTrack
      </Link>
    </div>
  );
}
