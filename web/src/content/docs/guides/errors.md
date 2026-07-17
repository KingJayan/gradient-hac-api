---
title: Errors
description: Status codes and error responses returned by the API.
---

All errors are JSON with a single `error` field.

| Status | Body | Meaning |
| --- | --- | --- |
| `401` | `{"error": "Invalid username or password"}` | Credential login failed |
| `401` | `{"error": "Invalid or expired session"}` | The replayed `X-HAC-Session` is no longer valid — re-authenticate with credentials |
| `500` | `{"error": "Failed to log in"}` | The HAC instance couldn't be reached or the login page failed to load |
| `500` | `{"error": "Failed to scrape data"}` | Logged in, but fetching or parsing the page failed |

Successful requests return `200` with the endpoint's payload.
