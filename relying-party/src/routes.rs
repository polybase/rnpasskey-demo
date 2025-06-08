use crate::{
    error::{Error, Result},
    model::{
        AuthenticationFinishRequest, AuthenticationFinishResponse, AuthenticationStartResponse,
        HealthResponse, RegistrationFinishResponse,
    },
    RegistrationState, UserData,
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

    let (ccr, reg_state) = webauthn
        .start_passkey_registration(user_unique_id, &username, &username, exclude_credentials)
        .map_err(|e| {
            info!("challenge_register -> {:?}", e);
            Error::Unknown(e)
        })?;

    // store the registration information - this is used when finishing up the registration process
    {
        let mut users_guard = webauthn_users.lock().await;
        users_guard.reg_states.insert(
            username.clone(),
            RegistrationState {
                user_unique_id: user_unique_id.to_string(),
                reg_state,
            },
        );
    }
    Ok(Json(ccr))
}

#[post("/registration/finish/{username}")]
pub async fn finish_registration(
    username: web::Path<String>,
    body: web::Json<RegisterPublicKeyCredential>,
    webauthn: web::Data<Webauthn>,
    webauthn_users: web::Data<Mutex<UserData>>,
) -> Result<web::Json<RegistrationFinishResponse>> {
    info!("finish_registration, username = {username:?}, body = {body:?}");

    let username = username.into_inner();

    let mut users_guard = webauthn_users.lock().await;

    // get the registration state using the username
    let RegistrationState {
        user_unique_id,
        reg_state,
    } = users_guard
        .reg_states
        .remove(&username)
        .ok_or(Error::CorruptRegistrationState(format!(
            "Missing registration state for: {username}"
        )))?;

    let user_unique_id = Uuid::parse_str(&user_unique_id)
        .map_err(|_| Error::CorruptRegistrationState("Invalid uuid".to_string()))?;

    // validate and finish user registration
    let sk = webauthn
        .finish_passkey_registration(&body, &reg_state)
        .map_err(|e| {
            info!("finish_passkey_registration error -> {:?}", e);
            Error::BadRequest(e)
        })?;

    // store the new finalised credential - this would be entering into the db in `production`
    users_guard
        .keys
        .entry(user_unique_id)
        .and_modify(|keys| keys.push(sk.clone()))
        .or_insert_with(|| vec![sk.clone()]);

    Ok(web::Json(RegistrationFinishResponse))
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
