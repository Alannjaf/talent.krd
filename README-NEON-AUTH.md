# Neon Auth Setup

This project uses Neon Auth with Stack Auth (@stackframe/stack) for authentication.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# Neon Auth environment variables
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key

# Neon database connection
DATABASE_URL=your_neon_database_url
```

## Authentication Routes

- Sign in: `/handler/sign-in`
- Sign up: `/handler/sign-up`
- All auth routes: `/handler/[...stack]`

## Database Schema

The `users` table now uses `stack_user_id` instead of `clerk_id` for user identification.

## Migration from Clerk

To complete the migration from Clerk to Stack Auth:

1. Run the database migration to rename `clerk_id` to `stack_user_id`:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

## Testing

Visit `http://localhost:3000/handler/sign-up` to create a new user account. The user will be automatically synced to your Neon database.
