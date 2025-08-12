# FastPay — Integration Guide Links

- Official integration start: `https://secure.fast-pay.cash/docs/start`
- Docs index (if accessible): `https://secure.fast-pay.cash/docs`

## Integration overview
1. Obtain merchant credentials from FastPay (merchant ID/secret, IPN/webhook URL).
2. Initiate a payment (order reference, amount, currency IQD, return/cancel URLs).
3. Redirect the customer to FastPay’s checkout.
4. Implement IPN/webhook to receive asynchronous notifications; verify signatures.
5. On success/failure, update order status in your database and show the result page.

## Notes
- Keep signing/verification strictly on the server.
- Configure and test IPN to handle downtime or user-abandoned sessions.
- Log all callbacks with request IDs for reconciliation.

> Refer to FastPay’s official docs for exact parameters and signature calculation.
