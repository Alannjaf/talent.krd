# Clerk setup

Create a `.env.local` in `app/` with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_or_test...
CLERK_SECRET_KEY=sk_live_or_test...
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
```

Then restart the dev server.
