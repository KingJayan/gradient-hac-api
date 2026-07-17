---
title: Authentication
description: How to send Home Access Center credentials to the API.
---

Credentials are accepted **only** via POST body or the `Authorization` header — never in the query string, so they can't leak into access logs, CDN caches, or `Referer` headers.

Three equivalent options:

## Form body

```bash
curl -X POST https://your-deployment.vercel.app/api/name \
  -d user=STUDENT_ID \
  -d pass=PASSWORD
```

## JSON body

```bash
curl -X POST https://your-deployment.vercel.app/api/name \
  -H "Content-Type: application/json" \
  -d '{"user": "STUDENT_ID", "pass": "PASSWORD"}'
```

The JSON body also accepts optional `link` and `session` fields.

## HTTP Basic Auth

```bash
curl -X POST https://your-deployment.vercel.app/api/name \
  -u STUDENT_ID:PASSWORD
```

## Fields

| Field | Where | Description |
| --- | --- | --- |
| `user` | form / JSON / Basic Auth | HAC username |
| `pass` | form / JSON / Basic Auth | HAC password |
| `link` | form / JSON / `X-HAC-Link` header | HAC base URL, defaults to `https://homeaccess.roundrockisd.org` |
| `session` | JSON / `X-HAC-Session` header | Existing session cookies — see [Session Reuse](/guides/sessions/) |

## Data handling

Credentials are used only to log in to the district's HAC instance for the duration of the request. They are not logged and not persisted server-side.
