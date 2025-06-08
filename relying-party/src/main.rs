use log::info;
use passkey_demo_relying_party::create_server;

static SERVER_PORT: u16 = 9000;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    env_logger::init();

    let server = create_server(SERVER_PORT)?;
    info!("Started server on localhost:{SERVER_PORT}");

    server.await?;

    Ok(())
}
