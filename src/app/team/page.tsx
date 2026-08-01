import { verifyOrgSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import InviteForm from "@/components/InviteForm";
import RemoveMemberButton from "@/components/RemoveMemberButton";

export default async function TeamPage() {
  const { organizationId, organizationName, role } = await verifyOrgSession();

  const [members, pendingInvitations] = await Promise.all([
    prisma.membership.findMany({
      where: { organizationId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.invitation.findMany({
      where: { organizationId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const sortedMembers = [...members].sort((a, b) =>
    a.role === b.role ? 0 : a.role === "OWNER" ? -1 : 1
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">
        {organizationName} - Team
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Everyone on your team sees and manages the same list of licenses.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Members</h2>
        <ul className="mt-3 divide-y divide-gray-100">
          {sortedMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {member.user.name || member.user.email}
                </div>
                <div className="text-xs text-gray-500">
                  {member.user.email}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {member.role === "OWNER" ? "Owner" : "Member"}
                </span>
                {role === "OWNER" && member.role !== "OWNER" && (
                  <RemoveMemberButton membershipId={member.id} />
                )}
              </div>
            </li>
          ))}
        </ul>

        {pendingInvitations.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-semibold text-gray-900">
              Pending invites
            </h2>
            <ul className="mt-3 divide-y divide-gray-100">
              {pendingInvitations.map((invitation) => (
                <li
                  key={invitation.id}
                  className="py-2 text-sm text-gray-600"
                >
                  {invitation.email}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {role === "OWNER" ? (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">
            Invite someone
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            They&apos;ll be able to see and manage every license on your
            team.
          </p>
          <div className="mt-3">
            <InviteForm />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          Only the team owner can invite people.
        </p>
      )}
    </div>
  );
}
