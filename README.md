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

## Client-side routing: deployment fallback
The project detail pages are client-side routes under `/projects/:slug`. Refreshing `/projects/api-security` directly must serve `index.html`, otherwise the host returns its own 404 before React Router runs. Add the rewrite that matches your host:

- Vercel: in `vercel.json`, rewrite every path to the SPA entry point.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- Netlify: in `public/_redirects`.

```
/*  /index.html  200
```

This is a deployment task and has not been implemented in the repository.

## Sitemap and Open Graph for detail pages
Add the six detail URLs to `sitemap.xml`:

- `/projects/web-application-security`
- `/projects/api-security`
- `/projects/mobile-security`
- `/projects/thick-client-security`
- `/projects/cloud-security`
- `/projects/ai-llm-security`

Give each page its own Open Graph title and description so shared links preview correctly. The document title and meta description are already set per page at runtime from `src/data/projects.ts`; static OG tags for crawlers would be a prerender or per-route build step.

## Content source
All project and methodology content lives in `src/data/projects.ts`. Edit that file rather than the components to change phases, tools, deliverables, tags or copy.
