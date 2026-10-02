# Jeffrey Jolly Portfolio

## Contact form production setup

The Contact form uses mock mode when `VITE_FORM_ENDPOINT` is empty. Mock submissions are logged in the browser console and are not sent or stored.

To enable delivery:

1. Create a Formspree account and a form for this portfolio.
2. Set the form's delivery destination to Jeffrey's personal email, `jeffryjolly@gmail.com`, not a TCS address.
3. Enable Formspree's spam filtering. The site also includes a honeypot field and a three-second submission guard.
4. Set `VITE_FORM_ENDPOINT` to the Formspree form endpoint in `.env.local` for local testing and in the hosting provider's environment settings for production. `VITE_` variables are public in the browser bundle, so never put API keys or secrets in them.
5. Add these directives to the production Content Security Policy. This project does not currently configure or emit these headers:

   - `connect-src 'self' https://formspree.io`
   - `form-action 'self' https://formspree.io`

6. Test a successful submission and verify delivery in the personal inbox. Also test Formspree spam filtering, invalid form values, and a failed or unreachable endpoint. Confirm the error state keeps the entered text and allows retry.

The privacy copy states a retention period of up to 90 days. Confirm the configured form service and account settings meet that period before enabling production submissions.
