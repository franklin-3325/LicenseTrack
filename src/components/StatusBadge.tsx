import {
  getLicenseStatus,
  STATUS_CLASSES,
  STATUS_LABEL,
} from "@/lib/licenseStatus";

export default function StatusBadge({
  expirationDate,
}: {
  expirationDate: Date;
}) {
  const status = getLicenseStatus(expirationDate);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
