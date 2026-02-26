# Fork Deployment with Login

This repository supports a fork setup with:

- Frontend on GitHub Pages (`https://<user>.github.io/<repo>/`)
- Your own backend (for example, Render)
- Your own GitHub OAuth App

## 1. Deploy Backend

Use `render.yaml` as a Render Blueprint to create:

- `atcoder-problems-backend` (web service)
- `atcoder-problems-db` (PostgreSQL)

Set backend environment variables:

- `CLIENT_ID`: GitHub OAuth App client ID
- `CLIENT_SECRET`: GitHub OAuth App client secret
- `FRONTEND_REDIRECT_URL`: for example `https://kkmia417.github.io/AtCoderProblems/`
- `CORS_ALLOW_ORIGINS`: for example `https://kkmia417.github.io`
- `SQL_URL`: injected automatically by `render.yaml`

Backend health check endpoint:

- `/healthcheck` should return `200`

## 2. Create GitHub OAuth App

Create a GitHub OAuth App and set:

- `Homepage URL`: `https://kkmia417.github.io/AtCoderProblems/`
- `Authorization callback URL`: `https://<your-backend-domain>/internal-api/authorize`

Use this app's `Client ID` and `Client Secret` in backend environment variables.

## 3. Set Frontend Build Variables

In GitHub repository settings:

- `Settings > Secrets and variables > Actions > Variables`

Add:

- `REACT_APP_INTERNAL_API_URL`: `https://<your-backend-domain>/internal-api`
- `REACT_APP_GITHUB_CLIENT_ID`: your OAuth client ID
- `REACT_APP_AUTHORIZATION_CALLBACK_URL`: `https://<your-backend-domain>/internal-api/authorize`

Optional:

- `REACT_APP_ATCODER_API_URL` (default is `https://kenkoooo.com/atcoder/atcoder-api`)

## 4. Redeploy Frontend

Push to `master` or run `Deploy Frontend To GitHub Pages` manually.

## 5. Verify Login

1. Open `https://kkmia417.github.io/AtCoderProblems/`
2. Click `Login` and complete GitHub OAuth
3. Confirm you return to the fork site and see `Account`
