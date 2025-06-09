PoC to demonstrate passkeys support for `Payy`/`zk-rollup` (separate PoC for now).

Currently only tested with `iOS`.

## App

Uses [react-native-passkey](https://github.com/f-23/react-native-passkey)

`apple-app-site-association` (AASA) and `assetlinks.json` hosting:

https://passkey-assets-hosting.web.app
https://console.firebase.google.com/project/passkey-assets-hosting/overview


## Backend (Relying Party)

Uses [webauthn-rs](https://github.com/kanidm/webauthn-rs)


## Build and Run

Server (Relying Party):

```
$ cd relying_party
$ RUST_LOG=passkey_demo_relying_party=info cargo run --release
```

Client (app + device authenticator):

```
$ yarn setup --clean && yarn ios --device
```


## Demo

https://linear.app/polybase/issue/ENG-2300/passkey-demo#comment-9850f2a0