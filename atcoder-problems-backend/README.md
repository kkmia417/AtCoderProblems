# atcoder-problems-backend

`atcoder-problems-backend` is a set of backend applications written in Rust.

Since the web app, which is running on your local machine, connects to the
production backend server, you don't need to run the backend applications in most cases.

> Note that the following steps assume that your frontend application runs on <http://localhost:3000>
> and your backend application runs on <http://localhost:8080>, which are the default values.

## Prerequisites

1. [Create a GitHub app](https://docs.github.com/en/developers/apps/creating-a-github-app).
   Keep the **client ID** and the **client secret**.
   - Remember to set the "User authorization callback URL" to
     `http://localhost:8080/internal-api/authorize`.
1. Launch an instance of [**PostgreSQL**](https://www.postgresql.org/) database on your machine.

## Environment Variables

- `SQL_URL` or `DATABASE_URL`: PostgreSQL connection URL
- `PORT`: server port (default: `8080`)
- `CLIENT_ID`: GitHub OAuth client ID
- `CLIENT_SECRET`: GitHub OAuth client secret
- `FRONTEND_REDIRECT_URL`: URL to redirect to after OAuth (default: `https://kenkoooo.com/atcoder/`)
- `CORS_ALLOW_ORIGINS`: comma separated allowed origins for CORS when using cross-origin frontend
  - example: `https://kkmia417.github.io,https://example.com`

## Build

```bash
docker-compose up -d
docker-compose exec backend-development cargo build
```

## Run

```bash
export SQL_URL=... # Connection URL of PostgreSQL
export CLIENT_ID=... # GitHub client_id, which is required to use the login function.
export CLIENT_SECRET=... # GitHub client_secret, which is required to use the login function.
export FRONTEND_REDIRECT_URL=http://localhost:3000/ # Frontend URL after login
export CORS_ALLOW_ORIGINS=http://localhost:3000 # Comma separated origins

# Run backend server
cargo run --bin run_server

# Run crawlers
cargo run --bin crawl_all_submissions
cargo run --bin crawl_for_virtual_contests
cargo run --bin crawl_from_new_contests
cargo run --bin crawl_problems
cargo run --bin crawl_recent_submissions
cargo run --bin crawl_whole_contest <contest_id>

# Run other tools
cargo run --bin batch_update
cargo run --bin delta_update
cargo run --bin dump_json
cargo run --bin fix_invalid_submissions
```

When `run_server` starts, it automatically creates required `internal_*` tables if they do not exist.

## Test

```bash
docker-compose up -d
docker-compose exec backend-development cargo test --workspace -- --test-threads=1
```

## Format

GitHub Action will check if the code base is formatted by `rustfmt`.
Please make sure that your change is formatted before sending a pull request.
You can format the code base with `cargo fmt` like the following:

```bash
docker-compose up -d
docker-compose exec backend-development cargo fmt
```
