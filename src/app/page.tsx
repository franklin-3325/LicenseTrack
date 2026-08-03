import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import PlatformSnapshot from "@/components/PlatformSnapshot";
import DependencyDiagram from "@/components/DependencyDiagram";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-navy">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-green">
              100% FREE FOR CONTRACTORS
            </span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
              Every license.
              <br />
              Every bond.
              <br />
              Every deadline.
              <br />
              <span className="text-brand-green">Covered.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-200/90">
              Free license, bond, insurance, and CE tracking for every state
              you work in - plus a team that can handle the renewals and get
              more of your crew licensed, whenever you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-md bg-steel px-6 py-3 text-center text-base font-medium text-white hover:bg-steel-dark"
              >
                Get started free
              </Link>
              <a
                href="#get-started"
                className="rounded-md border border-white/25 px-6 py-3 text-center text-base font-medium text-white hover:bg-white/10"
              >
                Get my free crew snapshot
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              From the team behind{" "}
              <span className="text-slate-300">Licensing Connection</span> -
              nationwide qualifier placement.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PlatformSnapshot />
          </div>
        </div>
      </div>

      {/* Pain points */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-center text-2xl font-semibold uppercase tracking-tight text-navy">
            Sound familiar?
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "A spreadsheet (or someone's memory) is the only record of when everyone's license renews.",
              "CE hours get done at the last minute, in the wrong category, and nobody's sure it actually got reported to the board.",
              "A GC asks for proof everyone's licensed and insured, and you're digging through email attachments to find it.",
              "One licensed journeyman short means apprentices who could be earning the company money instead sit on the bench.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-lg border border-navy/10 bg-offwhite p-4 text-sm text-charcoal"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary offering: License Management */}
      <div className="border-t border-navy/10 bg-offwhite py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold tracking-wide text-steel">
              PRIMARY - LICENSE MANAGEMENT
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold uppercase tracking-tight text-navy sm:text-4xl">
              We&apos;re the licensing department you don&apos;t have.
            </h2>
            <p className="mt-4 text-lg text-charcoal">
              Every license, bond, insurance policy, and CE requirement
              across every state you operate in - tracked, monitored, and
              renewed on time, by people who do this all day. You stop
              babysitting deadlines and get back to your actual job.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            <Pillar title="License">
              Every license and registration tracked and renewed on time, per
              each state&apos;s own cycle.
            </Pillar>
            <Pillar title="Bond">
              Surety bond expirations monitored, because your renewal is
              usually conditioned on a current bond.
            </Pillar>
            <Pillar title="Insurance">
              COI and workers&apos; comp dates watched, named and filed
              exactly as the state requires.
            </Pillar>
            <Pillar title="CE">
              Not just hours - the right categories, reported through the
              right state system before the deadline.
            </Pillar>
          </div>

          <div className="mt-16">
            <p className="text-center text-sm font-medium text-navy">
              Renewals aren&apos;t independent.
            </p>
            <div className="mt-6">
              <DependencyDiagram />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary offering: Workforce Licensing */}
      <div className="border-t border-navy/10 bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-semibold tracking-wide text-steel">
            SECONDARY - WORKFORCE LICENSING
          </span>
          <h2 className="font-display mt-2 text-3xl font-semibold uppercase tracking-tight text-navy sm:text-4xl">
            Get more of your crew licensed.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal">
            Get more of your crew licensed and legally field more workers -
            we find who qualifies and handle the whole application.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-charcoal">
            Getting a journeyman licensed isn&apos;t paperwork, it&apos;s
            capacity: each licensed worker raises how many apprentices you
            can legally put in the field.
          </p>
          <a
            href="#get-started"
            className="mt-8 inline-block rounded-md bg-navy px-6 py-3 text-base font-medium text-white hover:bg-navy-light"
          >
            Get my free crew snapshot
          </a>
          <p className="mt-2 text-xs text-charcoal">
            Free snapshot shows who qualifies. You pay only if we proceed.
          </p>
        </div>
      </div>

      {/* Free vs paid */}
      <div className="border-t border-navy/10 bg-offwhite py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-center text-2xl font-semibold uppercase tracking-tight text-navy">
            Free to track. Pay only for what you hand off.
          </h2>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border-2 border-brand-green bg-white p-6">
              <p className="font-display text-sm font-semibold tracking-wide text-brand-green">
                FREE, FOREVER
              </p>
              <ul className="mt-3 space-y-2 text-sm text-charcoal">
                <li>Track every license, bond, and COI</li>
                <li>Renewal &amp; CE deadline reminders</li>
                <li>Document storage per license</li>
                <li>Your whole team, one shared view</li>
              </ul>
            </div>
            <div className="rounded-lg border border-navy/10 bg-white p-6">
              <p className="font-display text-sm font-semibold tracking-wide text-navy">
                WHEN YOU&apos;RE READY
              </p>
              <ul className="mt-3 space-y-2 text-sm text-charcoal">
                <li>We file the renewals for you</li>
                <li>We handle CE compliance end to end</li>
                <li>We find and license more of your crew</li>
                <li>One-click compliance packet for bids</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lead form */}
      <div id="get-started" className="border-t border-navy/10 bg-white py-20">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-display text-center text-2xl font-semibold uppercase tracking-tight text-navy">
            Get your free snapshot
          </h2>
          <p className="mt-2 text-center text-charcoal">
            Tell us about your company and we&apos;ll tell you exactly where
            you stand - what&apos;s current, what&apos;s at risk, and who on
            your crew could be licensed next.
          </p>
          <div className="mt-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pillar({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5">
      <p className="font-display text-lg font-semibold tracking-wide text-navy">
        {title.toUpperCase()}
      </p>
      <p className="mt-1.5 text-sm text-charcoal">{children}</p>
    </div>
  );
}
