use actix_cors::Cors;
use actix_server::Server;
use actix_web::{App, HttpServer};

mod db;
pub mod error;
pub mod model;
pub mod routes;
mod services;

pub fn create_server(port: u16) -> eyre::Result<Server> {
    Ok(HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new().wrap(cors).service(routes::health)
    })
    .bind(("0.0.0.0", port))?
    .run())
}
