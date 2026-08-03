const ROWS = [
  { name: "General Contractor License", holder: "Mike R.", state: "CA", status: "Active", dot: "bg-brand-green" },
  { name: "Surety Bond", holder: "Company", state: "CA", status: "Expires soon", dot: "bg-amber-500" },
  { name: "Journeyman Electrical", holder: "Dana K.", state: "NV", status: "Active", dot: "bg-brand-green" },
];

export default function PlatformSnapshot() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 text-xs font-medium text-gray-400">
          Acme Roofing Co.
        </span>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          <SnapshotStat label="Expired" value="0" color="text-red-600" />
          <SnapshotStat label="30 days" value="1" color="text-amber-600" />
          <SnapshotStat label="90 days" value="0" color="text-yellow-600" />
          <SnapshotStat label="Active" value="6" color="text-brand-green" />
        </div>

        <div className="mt-4 space-y-1.5">
          {ROWS.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-navy">
                  {row.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {row.holder} &middot; {row.state}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-gray-600">
                <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnapshotStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-md bg-gray-50 px-2 py-2 text-center">
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  );
}
