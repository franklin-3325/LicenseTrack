import { notFound } from "next/navigation";
import { verifyOrgSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { updateLicense } from "@/app/actions/licenses";
import LicenseForm from "@/components/LicenseForm";
import DocumentUploadForm from "@/components/DocumentUploadForm";
import DeleteDocumentButton from "@/components/DeleteDocumentButton";

export default async function EditLicensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organizationId } = await verifyOrgSession();
  const { id } = await params;

  const license = await prisma.license.findUnique({
    where: { id },
    include: { documents: { orderBy: { uploadedAt: "desc" } } },
  });
  if (!license || license.organizationId !== organizationId) {
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
            holderName: license.holderName,
            state: license.state,
            category: license.category,
            issueDate: license.issueDate?.toISOString() ?? null,
            expirationDate: license.expirationDate.toISOString(),
            notes: license.notes,
          }}
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">
          Documents
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Attach the license certificate, insurance certificate, bond, or
          anything else worth keeping with this record.
        </p>

        {license.documents.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
            {license.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between py-2"
              >
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 underline hover:text-gray-900"
                >
                  {doc.fileName}
                </a>
                <DeleteDocumentButton documentId={doc.id} licenseId={id} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <DocumentUploadForm licenseId={id} />
        </div>
      </div>
    </div>
  );
}
