import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 text-center">
        <p className="text-sm font-medium text-gray-500">
          From the team behind Licensing Connection
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your outsourced licensing department.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
          We track every license, renewal, and CE requirement your crew is on
          the hook for - and handle the filing so nothing lapses, no bid gets
          delayed, and no qualifier issue catches you off guard.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#get-started"
            className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700"
          >
            Get my free compliance review
          </a>
          <Link
            href="/signup"
            className="rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Just want to track it yourself? Try it free
          </Link>
        </div>
      </div>

      {/* Pain points */}
      <div className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Sound familiar?
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              "A spreadsheet (or someone's memory) is the only record of when everyone's license renews.",
              "CE hours get done at the last minute, in the wrong category, and nobody's sure it actually got reported to the board.",
              "A GC asks for proof everyone's licensed and insured, and you're digging through email attachments to find it.",
              "If your qualifier's license lapses, your whole company's ability to work is at risk - and you find out too late.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What we handle */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            What we handle
          </h2>
          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            <Item title="Renewals, filed for you">
              We track every deadline and actually submit the paperwork and
              fees to the right board, on time - not just remind you it&apos;s
              due.
            </Item>
            <Item title="CE compliance, done right">
              The right courses, from an approved provider, in the specific
              categories your license requires - and properly recorded with
              the board, not just completed.
            </Item>
            <Item title="Insurance & bonding, tracked together">
              Renewal is often conditioned on current coverage. We keep
              insurance and bonds current alongside the licenses that depend
              on them.
            </Item>
            <Item title="Qualifier protection">
              We watch the license your company&apos;s standing depends on just as
              closely as the rest - so a qualifier issue never becomes a
              company-wide problem.
            </Item>
            <Item title="Proof, whenever you need it">
              One click gets you a clean compliance packet - every current
              license, cert, and document - ready for a GC, a bid, or an
              audit.
            </Item>
            <Item title="Contractor-specific expertise">
              Not a generalist business-license vendor. We come out of
              Licensing Connection, so contractor licensing - qualifiers
              included - is what we actually know.
            </Item>
          </dl>
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            How it works
          </h2>
          <ol className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-4">
            {[
              ["Tell us about your company", "Who's licensed, where, and in what."],
              ["We map what you're on the hook for", "Every license, renewal date, and CE requirement, laid out."],
              ["We handle it on your schedule", "Renewals filed, CE booked, documents kept current."],
              ["You're always ready", "Proof of compliance whenever a GC, bid, or audit asks."],
            ].map(([title, body], i) => (
              <li key={title}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <p className="mt-3 font-medium text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Who it's for */}
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Built for small and mid-size contracting companies
          </h2>
          <p className="mt-4 text-gray-600">
            If you&apos;ve got anywhere from a couple of licensed people to a few
            dozen - across one state or several - and nobody&apos;s job is
            &quot;full-time compliance,&quot; this is for you. Too small to
            justify hiring for it, too much at stake to keep winging it.
          </p>
        </div>
      </div>

      {/* Lead form */}
      <div id="get-started" className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Get your free compliance review
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Tell us about your company and we&apos;ll tell you exactly where
            you stand - what&apos;s current, what&apos;s at risk, and what it
            would take for us to handle it.
          </p>
          <div className="mt-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-semibold text-gray-900">{title}</dt>
      <dd className="mt-1 text-sm text-gray-600">{children}</dd>
    </div>
  );
}
