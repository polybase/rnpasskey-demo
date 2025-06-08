use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
}

// Registration
#[derive(Debug, Serialize)]
pub struct RegistrationFinishResponse;

// Authentication

#[derive(Debug, Serialize)]
pub struct AuthenticationFinishResponse;
