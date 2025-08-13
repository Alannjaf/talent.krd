import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dummy"
  );
  if (!enabled) {
    return (
      <div className="mx-auto max-w-md py-10 px-4">
        <p className="text-sm">
          Authentication is not configured. Please add Clerk keys to{" "}
          <code>.env.local</code>.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md py-10 px-4">
      <SignUp />
    </div>
  );
}
