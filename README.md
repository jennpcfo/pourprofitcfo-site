# pourprofitcfo.com

The public website for Pour Profit CFO, a DBA of Freedom Bookkeeping Plus.

- `site/`: the page itself, plain HTML and its assets.
- `Dockerfile`, `nginx.conf`: serves `site/` with unprivileged nginx.
- `.github/workflows/build.yml`: builds `ghcr.io/jennpcfo/pourprofitcfo-site:<commit>` on every
  change to `main`.
- `deploy/`: what runs on Jenn's cluster. Argo CD deploys it from here (app `pourprofitcfo-site`
  in `jennpcfo/platform`). To ship a change: merge it, wait for the build, then bump the image tag
  in `deploy/deployment.yaml` in a second pull request.

Moved here 2026-10-30 from a hand-uploaded Cloudflare Pages project (`pour-profit-cfo`). Cloudflare's
email obfuscation was undone so the contact link works without Cloudflare's script.

Argo CD retries a failed sync on its own; a new commit to `main` also starts a fresh attempt.
