use actix_web::{http::StatusCode, ResponseError};
use webauthn_rs::prelude::*;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("User not found")]
    UserNotFound,

    #[error("Unknown webauthn error")]
    Unknown(WebauthnError),

    #[error("Bad request")]
    BadRequest(#[from] WebauthnError),

    #[error("User has no credentials")]
    UserHasNoCredentials,
}

impl ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match self {
            Error::UserNotFound | Error::BadRequest(..) => StatusCode::BAD_REQUEST,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
