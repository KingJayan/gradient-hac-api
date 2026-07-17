# gradient HAC API

Self-hosted fork of [HomeAccessCenterAPI](https://github.com/nitheesh-cpu/HomeAccessCenterAPI-Golang) (MIT) used by the Gradient app. Scrapes HAC via Go + colly and runs as a Vercel serverless function.

## Why a fork

Upstream accepted credentials via query string (`?user=&pass=`), which leaks plaintext passwords to access logs, CDN edges, and `Referer` headers. This fork:

- **POST-only** for any endpoint that takes credentials.
- Accepts credentials via **POST form body**, **JSON body**, or **HTTP Basic Auth** (`Authorization: Basic …`).
- Query-string credentials are no longer read.

## Endpoints

`POST /api/{name|assignments|info|averages|classes|reportcard|ipr|transcript|rank}`

Body fields (form or JSON): `user`, `pass`, `link` (defaults to `https://accesscenter.roundrockisd.org`).

`GET /api/help` lists routes. `GET /api/admin` is a health check.

Documentation of the api available [here](https://gradient-hac-api-docs.vercel.app)

## License

MIT, inherited from upstream.
