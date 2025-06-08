use actix_web::{http::StatusCode, ResponseError};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {}

impl ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match self {
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
