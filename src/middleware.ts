import { clerkMiddleware } from "@clerk/nextjs/server";

// Enable Clerk middleware only when valid publishable key is provided
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidKey = Boolean(
  publishableKey && publishableKey !== "pk_test_dummy"
);

export default hasValidKey ? clerkMiddleware() : function middleware() {};

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
