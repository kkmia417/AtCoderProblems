pub mod endpoint;
pub mod error;
pub(crate) mod language_count;
pub mod middleware;
pub(crate) mod ranking;
pub(crate) mod services;
pub(crate) mod time_submissions;
pub(crate) mod user_info;
pub(crate) mod user_submissions;

use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{http::header, web, App, HttpResponseBuilder, HttpServer};
use anyhow::Result;
pub use services::config_services;

use self::middleware::github_auth::{GithubAuthentication, GithubClient};

const LOG_TEMPLATE: &str = r#"{"method":"%{method}xi", "url":"%U", "status":%s, "duration":%T}"#;

pub async fn run_server(
    pg_pool: sql_client::PgPool,
    github_client: GithubClient,
    port: u16,
    allowed_origins: Vec<String>,
) -> Result<()> {
    let host = "0.0.0.0";
    let allowed_origins = Arc::new(allowed_origins);
    HttpServer::new(move || {
        let cors = if allowed_origins.is_empty() {
            Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
        } else {
            let origins = Arc::clone(&allowed_origins);
            Cors::default()
                .allow_any_method()
                .allow_any_header()
                .supports_credentials()
                .allowed_origin_fn(move |origin, _| {
                    origin
                        .to_str()
                        .ok()
                        .map(|origin| origins.iter().any(|allowed| allowed == origin))
                        .unwrap_or(false)
                })
        };
        App::new()
            .app_data(web::Data::new(github_client.clone()))
            .app_data(web::Data::new(pg_pool.clone()))
            .wrap(cors)
            .wrap(GithubAuthentication::new(github_client.clone()))
            .wrap(
                actix_web::middleware::Logger::new(LOG_TEMPLATE)
                    .custom_request_replace("method", |req| req.method().to_string()),
            )
            .configure(services::config_services)
    })
    .bind((host, port))?
    .workers(4)
    .run()
    .await?;
    Ok(())
}

pub(crate) trait MakeCors {
    fn make_cors(&mut self) -> &mut Self;
}

impl MakeCors for HttpResponseBuilder {
    fn make_cors(&mut self) -> &mut Self {
        self.insert_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
    }
}
