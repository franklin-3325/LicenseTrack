import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-wide text-navy">
          LicenseTrack
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/team" className="text-gray-600 hover:text-gray-900">
              Team
            </Link>
            <span className="hidden text-gray-400 sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-steel px-3 py-1.5 text-white hover:bg-steel-dark"
            >
              Sign up free
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
