# areeba — E‑commerce Payment Gateway

- areeba (company site): `https://www.areeba.com/`
- Sandbox gateway docs (areeba-branded on IXOPAY): `https://areeba.ixopaysandbox.com/documentation/gateway`
- Mastercard Payment Gateway Services (MPGS) docs (often used by regional PSPs): `https://developer.mastercard.com/mpgs/documentation/`

## Integration overview
1. Contact areeba for merchant onboarding and to confirm the exact gateway stack (native API, MPGS, or IXOPAY platform) for your account.
2. Obtain API credentials and test environment access from areeba.
3. Implement create-payment/checkout redirects and webhook handling as per the confirmed docs.
4. Verify signatures/HMAC and reconcile transactions against your order records.

## Notes
- areeba may provision access through a partner platform. Confirm which documentation applies to your account.
- Keep secrets on the server and implement idempotent payment creation.

> Replace this file with provider-specific endpoints once areeba shares your merchant documentation.
