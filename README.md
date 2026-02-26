# AtCoder Problems

![CI](https://github.com/kenkoooo/AtCoderProblems/workflows/CI/badge.svg)

[AtCoder Problems](https://kenkoooo.com/atcoder/) is a web application to help AtCoder users to solve problems and manage progress more efficiently.

![screenshot](./screenshot.png)

# Documents
- [Front-end web application](./atcoder-problems-frontend/README.md)
- [Back-end server application](./atcoder-problems-backend/README.md)
- [API / Datasets](./doc/api.md)
- [FAQ (en)](./doc/faq_en.md) / [FAQ (ja)](./doc/faq_ja.md)

# Useful Commands

```bash
# Show all commands
make

# Start local development environment
make up/d

# Check status and logs
make ps
make logs/backend
make logs/frontend

# Run checks
make check/backend
make lint/frontend
make test/frontend
make ci/local
```

# Deployment

The frontend is automatically deployed to GitHub Pages when you push to `master`.

- URL: <https://kkmia417.github.io/AtCoderProblems/>
- Workflow: `.github/workflows/deploy-pages.yml`

If this is your first deployment, enable GitHub Pages in your repository settings:

1. Open **Settings > Pages**
2. Set **Source** to **GitHub Actions**
