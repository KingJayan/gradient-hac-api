---
title: Getting Started
description: Make your first request to the gradient HAC API.
---

All data endpoints are `POST` and take Home Access Center credentials in the request body.

## First request

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -d user=STUDENT_ID \
  -d pass=PASSWORD
```

Response:

```json
{
  "AP Calculus AB": "98.5",
  "AP English III": "94.2"
}
```

## Other districts

The API defaults to `https://homeaccess.roundrockisd.org`. For another district, pass its HAC base URL as `link`:

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -d user=STUDENT_ID \
  -d pass=PASSWORD \
  -d link=https://homeaccess.katyisd.org
```

`link` can also be sent as the `X-HAC-Link` header.

## Utility routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/help` | GET | Lists all available routes |
| `/api/admin` | GET | Health check, returns `ok` |

## Next steps

- [Authentication](/guides/authentication/) — all the ways to send credentials
- [Session Reuse](/guides/sessions/) — skip the login round-trip
- Endpoint reference in the sidebar
