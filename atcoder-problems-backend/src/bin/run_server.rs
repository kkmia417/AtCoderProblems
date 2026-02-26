use std::env;

use atcoder_problems_backend::server::middleware::github_auth::GithubClient;
use atcoder_problems_backend::server::run_server;
use atcoder_problems_backend::utils::init_log_config;
use sql_client::{query, PgPool};

async fn initialize_internal_tables(pool: &PgPool) -> anyhow::Result<()> {
    let statements = [
        "CREATE TABLE IF NOT EXISTS internal_users (internal_user_id VARCHAR(255) NOT NULL, atcoder_user_id VARCHAR(255) DEFAULT NULL, PRIMARY KEY (internal_user_id))",
        "CREATE TABLE IF NOT EXISTS internal_problem_lists (internal_list_id VARCHAR(255) NOT NULL, internal_user_id VARCHAR(255) REFERENCES internal_users ON DELETE CASCADE ON UPDATE CASCADE, internal_list_name VARCHAR(255) DEFAULT '', PRIMARY KEY (internal_list_id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_problem_lists_user ON internal_problem_lists (internal_user_id)",
        "CREATE TABLE IF NOT EXISTS internal_problem_list_items (internal_list_id VARCHAR(255) REFERENCES internal_problem_lists ON DELETE CASCADE ON UPDATE CASCADE, problem_id VARCHAR(255) NOT NULL, memo VARCHAR(255) DEFAULT '', PRIMARY KEY (internal_list_id, problem_id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_problem_list_items_list ON internal_problem_list_items (internal_list_id)",
        "CREATE TABLE IF NOT EXISTS internal_virtual_contests (id VARCHAR(255) NOT NULL, title VARCHAR(255) DEFAULT '', memo VARCHAR(255) DEFAULT '', internal_user_id VARCHAR(255) REFERENCES internal_users ON DELETE CASCADE ON UPDATE CASCADE, start_epoch_second BIGINT NOT NULL, duration_second BIGINT NOT NULL, mode VARCHAR(255) DEFAULT NULL, is_public BOOLEAN NOT NULL DEFAULT TRUE, penalty_second BIGINT NOT NULL DEFAULT 0, PRIMARY KEY (id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_virtual_contests_user ON internal_virtual_contests (internal_user_id)",
        "CREATE INDEX IF NOT EXISTS idx_internal_virtual_contests_start_epoch ON internal_virtual_contests (start_epoch_second)",
        "CREATE TABLE IF NOT EXISTS internal_virtual_contest_items (problem_id VARCHAR(255) NOT NULL, internal_virtual_contest_id VARCHAR(255) REFERENCES internal_virtual_contests(id) ON DELETE CASCADE ON UPDATE CASCADE, user_defined_point BIGINT DEFAULT NULL, user_defined_order BIGINT DEFAULT NULL, PRIMARY KEY (problem_id, internal_virtual_contest_id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_virtual_contest_items_contest ON internal_virtual_contest_items (internal_virtual_contest_id)",
        "CREATE TABLE IF NOT EXISTS internal_virtual_contest_participants (internal_virtual_contest_id VARCHAR(255) REFERENCES internal_virtual_contests(id) ON DELETE CASCADE ON UPDATE CASCADE, internal_user_id VARCHAR(255) REFERENCES internal_users ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (internal_virtual_contest_id, internal_user_id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_virtual_contest_participants_user ON internal_virtual_contest_participants (internal_user_id)",
        "CREATE TABLE IF NOT EXISTS internal_progress_reset (internal_user_id VARCHAR(255) REFERENCES internal_users ON DELETE CASCADE ON UPDATE CASCADE, problem_id VARCHAR(255) NOT NULL, reset_epoch_second BIGINT NOT NULL, PRIMARY KEY (internal_user_id, problem_id))",
        "CREATE INDEX IF NOT EXISTS idx_internal_progress_reset_user ON internal_progress_reset (internal_user_id)",
    ];
    for statement in statements {
        query(statement).execute(pool).await?;
    }
    Ok(())
}

#[actix_web::main]
async fn main() {
    init_log_config().unwrap();
    let database_url = env::var("SQL_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .expect("SQL_URL or DATABASE_URL is not set.");
    let port = env::var("PORT")
        .ok()
        .and_then(|x| x.parse::<u16>().ok())
        .unwrap_or(8080);
    let allowed_origins = env::var("CORS_ALLOW_ORIGINS")
        .unwrap_or_default()
        .split(',')
        .map(str::trim)
        .filter(|x| !x.is_empty())
        .map(str::to_string)
        .collect::<Vec<_>>();

    let client_id = env::var("CLIENT_ID").unwrap_or_else(|_| String::new());
    let client_secret = env::var("CLIENT_SECRET").unwrap_or_else(|_| String::new());

    let pg_pool = sql_client::initialize_pool(&database_url)
        .await
        .expect("Failed to initialize the connection pool");
    initialize_internal_tables(&pg_pool)
        .await
        .expect("Failed to initialize internal tables");
    let github = GithubClient::new(
        &client_id,
        &client_secret,
        "https://github.com",
        "https://api.github.com",
    )
    .expect("Failed to create github client");
    run_server(pg_pool, github, port, allowed_origins)
        .await
        .expect("Failed to run server");
}
