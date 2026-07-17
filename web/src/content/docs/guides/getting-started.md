---
title: Getting Started
description: Make your first request to the gradient HAC API.
---

All data endpoints are `POST` and take Home Access Center credentials in the request body.

## First request

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -d user=STUDENT_ID \
  -d pass=PASSWORD \
  -d link=https://accesscenter.roundrockisd.org
```

Response:

```json
{
  "AP Calculus AB": "98.5",
  "AP English III": "94.2"
}
```

## Choosing your district

Always pass your district's HAC base URL as `link`. Every district hosts its own
Home Access Center on a different domain, so the value that works for you depends
entirely on your school — there is no single URL that works everywhere.

To find yours, open Home Access Center in a browser and copy the scheme + host
from the address bar (everything before `/HomeAccess/...`). A few examples:

| District | `link` |
| --- | --- |
| Round Rock ISD | `https://accesscenter.roundrockisd.org` |
| Katy ISD | `https://homeaccess.katyisd.org` |

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -d user=STUDENT_ID \
  -d pass=PASSWORD \
  -d link=https://accesscenter.roundrockisd.org
```

`link` can also be sent as the `X-HAC-Link` header.

:::caution
If you omit `link`, the API falls back to `https://accesscenter.roundrockisd.org`,
which is **not** a working host for any other district. Treat `link` as required.
:::

## Utility routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/help` | GET | Lists all available routes |
| `/api/admin` | GET | Health check, returns `ok` |

## Next steps

- [Authentication](/guides/authentication/) — all the ways to send credentials
- [Session Reuse](/guides/sessions/) — skip the login round-trip
- Endpoint reference in the sidebar
