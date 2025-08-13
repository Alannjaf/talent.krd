// Stack Auth handles authentication via their SDK
// No middleware needed for basic auth flow as Stack Auth uses /handler/[...stack] route

export default function middleware() {}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
