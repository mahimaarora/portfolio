# Mahima Arora's portfolio

Static website for **mahimaarora.com**. Website files live in `site/`.

The current page shows a six-frame terminal asterisk that blooms and contracts,
a highlight that moves across the text, and playful rotating verbs.
It supports pausing, reduced motion, and background-tab suspension.
With Reduce Motion enabled, the page starts still and offers **Play animation**.
It also supports older Safari media-query listeners and returning from the back/forward cache.
Edit the verb list in `site/agent.js` and the appearance in `site/style.css`.

## Local preview

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000. No dependencies or build step are needed yet.

## CI/CD

The `CI and deploy` workflow checks pull requests and pushes to `main`.
It checks the animation behavior, then starts a local HTTP server and verifies
that the HTML, stylesheet, script, and favicon are served correctly.
Run the behavior check locally with `node scripts/check-agent.cjs`.
After a successful check on `main`, it publishes only `site/` to GitHub Pages.
Pull requests do not deploy. The workflow can also be run manually on `main`.

In GitHub Settings → Pages, select **GitHub Actions** as the source and set
the custom domain to **mahimaarora.com**. Enable **Enforce HTTPS** once the
certificate is ready. Free GitHub Pages requires a public repository.

## Squarespace DNS

Configure the custom domain in GitHub Pages before changing these DNS records.

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `mahimaarora.github.io` |

Replace only conflicting website records. Keep email and verification records.
GitHub manages the certificate and redirects `www` to the configured apex domain.
For an Actions deployment, the custom domain is stored in Pages settings;
a `CNAME` file in the repository is not required.

## Rollback

Revert the relevant commit on `main`. The workflow deploys the reverted website.

See GitHub's [workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
