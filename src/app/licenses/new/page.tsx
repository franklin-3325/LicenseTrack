import { verifyOrgSession } from "@/lib/dal";
import { createLicense } from "@/app/actions/licenses";
import LicenseForm from "@/components/LicenseForm";

export default async function NewLicensePage() {
  await verifyOrgSession();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Add a license</h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <LicenseForm action={createLicense} submitLabel="Add license" />
      </div>
    </div>
  );
}
