---
title: POST /api/name
description: Returns the student's name.
sidebar:
  label: name
  order: 1
---

Returns the logged-in student's name.

```bash
curl -X POST https://your-deployment.vercel.app/api/name \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{ "name": "Jane Doe" }
```
