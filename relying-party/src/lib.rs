use actix_cors::Cors;
use actix_server::Server;
use actix_web::{web, App, HttpServer};
use log::info;
use std::collections::HashMap;
use tokio::sync::Mutex;
use webauthn_rs::prelude::*;

pub mod error;
pub mod model;
pub mod routes;

static RP_NAME: &'static str = "rnpasskey-demo-rp";
static RP_ID: &'static str = "passkey-assets-hosting.web.app";

// In-memory db
pub(crate) struct UserData {
    pub(crate) name_to_id: HashMap<String, Uuid>,
    pub(crate) keys: HashMap<Uuid, Vec<Passkey>>,
    pub(crate) reg_states: HashMap<String, RegistrationState>,
}

pub(crate) struct RegistrationState {
    pub(crate) user_unique_id: String,
    pub(crate) reg_state: PasskeyRegistration,
}

fn startup() -> (web::Data<Webauthn>, web::Data<Mutex<UserData>>) {
    let rp_id = &RP_ID;
    let rp_origin =
        Url::parse("https://passkey-assets-hosting.web.app").expect("Invalid rp_origin URL");

    let builder = WebauthnBuilder::new(rp_id, &rp_origin).expect("Invalid webauthn configuration");
    let builder = builder.rp_name(RP_NAME);

    let webauthn = web::Data::new(builder.build().expect("Invalid webauthn configuration"));
    let webauthn_users = web::Data::new(Mutex::new(UserData {
        name_to_id: HashMap::new(),
        keys: HashMap::new(),
        reg_states: HashMap::new(),
    }));

    info!("Finished setting up webauthn and webauthn-rs in-memory db");

    (webauthn, webauthn_users)
}

pub fn create_server(port: u16) -> eyre::Result<Server> {
    let (webauthn, webauthn_users) = startup();

    Ok(HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(webauthn.clone())
            .app_data(webauthn_users.clone())
            .service(routes::health)
            .service(routes::start_registration)
            .service(routes::finish_registration)
            .service(routes::start_authentication)
            .service(routes::finish_authentication)
    })
    .bind(("0.0.0.0", port))?
    .run())
}
