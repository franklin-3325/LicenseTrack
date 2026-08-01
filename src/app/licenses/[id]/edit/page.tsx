import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { updateLicense } from "@/app/actions/licenses";
import LicenseForm from "@/components/LicenseForm";

export default async function EditLicensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await verifySession();
  const { id } = await params;

  const license = await prisma.license.findUnique({ where: { id } });
  if (!license || license.userId !== userId) {
    notFound();
  }

  const boundUpdateLicense = updateLicense.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Edit license</h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <LicenseForm
          action={boundUpdateLicense}
          submitLabel="Save changes"
          defaultValues={{
            licenseName: license.licenseName,
            licenseNumber: license.licenseNumber,
            issuingAuthority: license.issuingAuthority,
            state: license.state,
            category: license.category,
            issueDate: license.issueDate?.toISOString() ?? null,
            expirationDate: license.expirationDate.toISOString(),
            notes: license.notes,
          }}
        />
      </div>
    </div>
  );
}
