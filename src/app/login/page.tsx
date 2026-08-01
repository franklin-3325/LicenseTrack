import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-gray-900">Log in</h1>
      <p className="mt-1 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href={invite ? `/signup?invite=${invite}` : "/signup"}
          className="font-medium text-gray-900 underline"
        >
          Sign up
        </Link>
      </p>
      <div className="mt-6">
        <LoginForm inviteToken={invite} />
      </div>
    </div>
  );
}
