# First Iraqi Bank (FIB) — Web Payments and SDKs

- Official Web Payments docs: `https://fib.iq/integrations/web-payments/`
- Node.js SDK docs: `https://first-iraqi-bank.github.io/fib-nodejs-payment-sdk/guide/usage/payment.html`
- Python SDK: `https://github.com/First-Iraqi-Bank/fib-python-payment-sdk`
- Laravel SDK: `https://github.com/First-Iraqi-Bank/fib-laravel-payment-sdk`
- PHP SDK: `https://github.com/First-Iraqi-Bank/fib-php-payment-sdk`

## Integration overview
1. Apply for merchant credentials with FIB (merchant/account details, client key/secret, callback URLs).
2. Server-side: create a payment (amount, currency IQD, order reference, description, return/cancel URLs).
3. Redirect the customer to FIB checkout or invoke the mobile flow as documented.
4. Handle payment result via your return URL and verify on server.
5. Implement webhook/callback handler to receive asynchronous status updates; verify signatures.
6. Reconcile by fetching payment status from your backend if needed.

## Notes
- Use server-side code to sign requests and keep secrets out of the browser.
- Implement idempotency on "create payment" to avoid duplicates on retries.
- Store payment lifecycle events (created, authorized, captured, failed, refunded) for audit.
- Test thoroughly in FIB’s sandbox (or test mode) if provided to you by FIB.

> Always defer to the latest guidance in FIB’s official docs linked above.
