<h2><code>gradient</code> HAC API</h2>

Self-hosted fork of [HomeAccessCenterAPI](https://github.com/nitheesh-cpu/HomeAccessCenterAPI-Golang) (MIT) used by the Gradient app. Scrapes HAC via Go + colly and runs as a Vercel serverless function.

### Why a fork

Upstream used credentials via query string (`?user=&pass=`), which is not good for obvious security reasons.

This fork:
- Is **POST-only** for any endpoint that takes credentials.
- Accepts credentials via **POST form body**, **JSON body**, or **HTTP Basic Auth** (`Authorization: Basic …`)
- Query-string credentials are no longer read.

### Endpoints

`POST /api/{name|assignments|info|averages|classes|reportcard|ipr|transcript|rank}`

Body fields (form or JSON): `user`, `pass`, `link` (defaults to `https://accesscenter.roundrockisd.org`)

`GET /api/help` lists routes, `GET /api/admin` is a health check.

Documentation of the api available [here](https://gradient-hac-api-docs.vercel.app).

### License

MIT, inherited from upstream
