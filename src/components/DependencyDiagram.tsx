const INPUTS = [
  { label: "Bond", detail: "Current & filed" },
  { label: "Insurance", detail: "COI + workers' comp" },
  { label: "CE Hours", detail: "Right categories, reported" },
];

export default function DependencyDiagram() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0">
        {INPUTS.map((input, i) => (
          <div key={input.label} className="flex items-center gap-3 sm:gap-4">
            <div className="w-36 rounded-lg border border-navy/10 bg-white px-3 py-3 text-center shadow-sm sm:w-40">
              <p className="font-display text-sm font-semibold tracking-wide text-navy">
                {input.label.toUpperCase()}
              </p>
              <p className="mt-0.5 text-xs text-charcoal">{input.detail}</p>
            </div>
            {i < INPUTS.length - 1 && (
              <span className="font-display text-2xl text-steel">+</span>
            )}
          </div>
        ))}

        <span className="font-display mx-3 hidden text-2xl text-navy sm:inline">
          =
        </span>
        <span className="font-display my-2 text-2xl text-navy sm:hidden">
          =
        </span>

        <div className="w-40 rounded-lg border-2 border-brand-green bg-navy px-4 py-3 text-center shadow-sm sm:w-44">
          <p className="font-display text-sm font-semibold tracking-wide text-white">
            LICENSE
          </p>
          <p className="mt-0.5 text-xs text-brand-green">Active &amp; renewable</p>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-sm text-charcoal">
        Miss any one of these, and the license lapses with it. A spreadsheet
        tracks four dates. It doesn&apos;t know they&apos;re connected.
      </p>
    </div>
  );
}
