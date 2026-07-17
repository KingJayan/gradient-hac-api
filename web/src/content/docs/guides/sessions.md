---
title: Session Reuse
description: Skip the HAC login round-trip by reusing session cookies.
---

Logging in to HAC costs an extra round-trip on every request. To avoid it, the API returns the HAC session cookies after a successful credential login, and lets you replay them on subsequent requests.

## 1. Capture the session

On any successful credential login, the response includes an `X-HAC-Session` header:

```bash
SESSION=$(curl -si -X POST https://your-deployment.vercel.app/api/name \
  -u STUDENT_ID:PASSWORD \
  | grep -i '^x-hac-session:' | cut -d' ' -f2- | tr -d '\r')
```

## 2. Reuse it

Send it back as the `X-HAC-Session` request header — no credentials needed:

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -H "X-HAC-Session: $SESSION"
```

Or as the `session` field of a JSON body:

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -H "Content-Type: application/json" \
  -d "{\"session\": \"$SESSION\"}"
```

If the session is for a non-default district, also send `link` (or `X-HAC-Link`).

## 3. Handle expiry

HAC sessions expire. When that happens the API responds:

```json
{ "error": "Invalid or expired session" }
```

with status `401`. Fall back to a credential login, capture the fresh `X-HAC-Session`, and continue.

:::tip
A typical client flow: cache the session string in memory, use it for every call, and only re-authenticate when a `401` comes back.
:::
