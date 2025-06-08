use crate::{error::Result, model::HealthResponse};
use actix_web::{get, post, web::Json, HttpResponse, Responder};
use log::info;

#[get("/health")]
pub async fn health() -> Result<Json<HealthResponse>> {
    info!("Getting server health");

    Ok(Json(HealthResponse {
        status: String::from("OK"),
    }))
}

#[post("/registration/start")]
pub async fn start_registration() -> impl Responder {
    HttpResponse::Ok().finish()
}

#[post("/registration/finish")]
pub async fn finish_registration() -> impl Responder {
    HttpResponse::Ok().finish()
}

#[post("/auth/start")]
pub async fn start_authentication() -> impl Responder {
    HttpResponse::Ok().finish()
}

#[post("/auth/finish")]
pub async fn finish_authentication() -> impl Responder {
    HttpResponse::Ok().finish()
}
