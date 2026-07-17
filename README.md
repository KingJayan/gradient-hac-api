# gradient HAC API

Self-hosted fork of [HomeAccessCenterAPI](https://github.com/nitheesh-cpu/HomeAccessCenterAPI-Golang) (MIT) used by the Gradient app. Scrapes HAC via Go + colly and runs as a Vercel serverless function.

## Why a fork

Upstream accepted credentials via query string (`?user=&pass=`), which leaks plaintext passwords to access logs, CDN edges, and `Referer` headers. This fork:

- **POST-only** for any endpoint that takes credentials.
- Accepts credentials via **POST form body**, **JSON body**, or **HTTP Basic Auth** (`Authorization: Basic …`).
- Query-string credentials are no longer read.

## Endpoints

`POST /api/{name|assignments|info|averages|classes|reportcard|ipr|transcript|rank}`

Body fields (form or JSON): `user`, `pass`, `link` (defaults to `https://homeaccess.roundrockisd.org`).

`GET /api/help` lists routes. `GET /api/admin` is a health check.

## Data flow disclosure

This API receives plaintext HAC credentials on every authenticated request. They are used only to log in to the user's district HAC instance and are not persisted server-side. The Gradient app talks only to a deployment of this code that the project maintainers control; it does not send credentials to the upstream `homeaccesscenterapi.vercel.app`.

## License

MIT, inherited from upstream.
