use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
}

// Registration
#[derive(Debug, Serialize)]
pub struct RegistrationFinishResponse;

// Authentication

#[derive(Debug, Serialize)]
pub struct AuthenticationStartResponse {}

#[derive(Debug, Deserialize)]
pub struct AuthenticationFinishRequest {}

#[derive(Debug, Serialize)]
pub struct AuthenticationFinishResponse {}
