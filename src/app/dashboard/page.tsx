import Link from "next/link";
import { verifyOrgSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { LicenseModel } from "@/generated/prisma/models";
import { getLicenseStatus, daysUntil } from "@/lib/licenseStatus";
import StatusBadge from "@/components/StatusBadge";
import DeleteLicenseButton from "@/components/DeleteLicenseButton";

type LicenseWithDocCount = LicenseModel & { _count: { documents: number } };

export default async function DashboardPage() {
  const { organizationId, organizationName } = await verifyOrgSession();

  const licenses = await prisma.license.findMany({
    where: { organizationId },
    orderBy: { expirationDate: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  const counts = { expired: 0, critical: 0, warning: 0, ok: 0 };
  for (const license of licenses) {
    counts[getLicenseStatus(license.expirationDate)]++;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {organizationName}
          </h1>
          <p className="text-sm text-gray-500">
            <Link href="/team" className="underline hover:text-gray-700">
              Manage team
            </Link>
          </p>
        </div>
        <Link
          href="/licenses/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + Add license
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Expired" count={counts.expired} color="text-red-700" />
        <SummaryCard label="Expiring in 30 days" count={counts.critical} color="text-orange-700" />
        <SummaryCard label="Expiring in 90 days" count={counts.warning} color="text-yellow-700" />
        <SummaryCard label="Active" count={counts.ok} color="text-green-700" />
      </div>

      <div className="mt-8">
        {licenses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-600">
              You haven&apos;t added any licenses yet.
            </p>
            <Link
              href="/licenses/new"
              className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Add your first license
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>License</Th>
                  <Th>Holder</Th>
                  <Th>State / Category</Th>
                  <Th>Expires</Th>
                  <Th>Status</Th>
                  <Th>
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {licenses.map((license: LicenseWithDocCount) => {
                  const days = daysUntil(license.expirationDate);
                  return (
                    <tr key={license.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {license.licenseName}
                        </div>
                        {license.licenseNumber && (
                          <div className="text-xs text-gray-500">
                            #{license.licenseNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {license.holderName || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {[license.state, license.category]
                          .filter(Boolean)
                          .join(" / ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>
                          {license.expirationDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {days < 0
                            ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`
                            : `in ${days} day${days === 1 ? "" : "s"}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge expirationDate={license.expirationDate} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {license._count.documents > 0 && (
                            <span
                              className="text-xs text-gray-400"
                              title={`${license._count.documents} document(s) attached`}
                            >
                              📎 {license._count.documents}
                            </span>
                          )}
                          <Link
                            href={`/licenses/${license.id}/edit`}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            Edit
                          </Link>
                          <DeleteLicenseButton id={license.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className={`text-2xl font-semibold ${color}`}>{count}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}
