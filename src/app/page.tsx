import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Never miss a license renewal again.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
        LicenseTrack keeps every contractor license you&apos;re responsible for in
        one place, so you always know what&apos;s expiring and when. Built for
        individuals and companies managing more licenses than they can track
        in a spreadsheet.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700"
        >
          Create your free account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
        >
          Log in
        </Link>
      </div>

      <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 text-left sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-gray-900">Track everything</dt>
          <dd className="mt-1 text-sm text-gray-600">
            License numbers, issuing authorities, states, and renewal dates
            for every license you manage.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">See what&apos;s urgent</dt>
          <dd className="mt-1 text-sm text-gray-600">
            A dashboard that highlights what&apos;s expired or expiring soon, so
            nothing slips through the cracks.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Get reminded</dt>
          <dd className="mt-1 text-sm text-gray-600">
            Automatic email reminders before a license expires.
          </dd>
        </div>
      </dl>
    </div>
  );
}
