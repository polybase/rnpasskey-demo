use crate::{
    error::{Error, Result},
    model::{
        AuthenticationFinishRequest, AuthenticationFinishResponse, AuthenticationStartResponse,
        HealthResponse, RegistrationFinishResponse,
    },
    UserData,
};
use actix_web::{
    get, post,
    web::{self, Json},
};
use log::info;
use tokio::sync::Mutex;
use webauthn_rs::prelude::{CreationChallengeResponse, RegisterPublicKeyCredential, *};

#[get("/health")]
pub async fn health() -> Result<Json<HealthResponse>> {
    info!("Getting server health");

    Ok(Json(HealthResponse {
        status: String::from("OK"),
    }))
}

#[post("/registration/start/{username}")]
pub async fn start_registration(
    username: web::Path<String>,
    webauthn: web::Data<Webauthn>,
    webauthn_users: web::Data<Mutex<UserData>>,
) -> Result<web::Json<CreationChallengeResponse>> {
    info!("start_registration, username = {username:#?}");

    let user_unique_id = {
        let users_guard = webauthn_users.lock().await;
        users_guard
            .name_to_id
            .get(username.as_str())
            .copied()
            .unwrap_or_else(Uuid::new_v4)
    };

    let exclude_credentials = {
        let users_guard = webauthn_users.lock().await;
        users_guard
            .keys
            .get(&user_unique_id)
            .map(|keys| keys.iter().map(|sk| sk.cred_id().clone()).collect())
    };

    let (ccr, _reg_state) = webauthn
        .start_passkey_registration(user_unique_id, &username, &username, exclude_credentials)
        .map_err(|e| {
            info!("challenge_register -> {:?}", e);
            Error::Unknown(e)
        })?;

    Ok(Json(ccr))
}

#[post("/registration/finish")]
pub async fn finish_registration(
    body: web::Json<RegisterPublicKeyCredential>,
) -> Result<web::Json<RegistrationFinishResponse>> {
    info!("finish_registration, body = {body:#?}");
    todo!()
}

#[post("/authentication/start/{username}")]
pub async fn start_authentication(
    username: web::Path<String>,
) -> Result<web::Json<AuthenticationStartResponse>> {
    info!("start_authentication, username = {username:#?}");
    todo!()
}

#[post("/authentication/finish")]
pub async fn finish_authentication(
    body: web::Json<AuthenticationFinishRequest>,
) -> Result<web::Json<AuthenticationFinishResponse>> {
    info!("finish_authentication, body = {body:#?}");
    todo!()
}
