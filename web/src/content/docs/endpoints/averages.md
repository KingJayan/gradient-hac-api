---
title: POST /api/averages
description: Returns current class averages.
sidebar:
  label: averages
  order: 4
---

Returns each class's current average, in schedule order.

```bash
curl -X POST https://your-deployment.vercel.app/api/averages \
  -H "X-HAC-Link: https://accesscenter.roundrockisd.org" \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "AP Calculus AB": "98.5",
  "AP English III": "94.2",
  "Chemistry": "91.0"
}
```
