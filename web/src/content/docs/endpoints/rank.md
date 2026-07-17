---
title: POST /api/rank
description: Returns GPA, class rank, and quartile only.
sidebar:
  label: rank
  order: 9
---

Returns just the cumulative GPA block from the transcript page — faster than [/api/transcript](/endpoints/transcript/) when you don't need course history.

```bash
curl -X POST https://your-deployment.vercel.app/api/rank \
  -H "X-HAC-Link: https://accesscenter.roundrockisd.org" \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "Weighted GPA": "5.4321",
  "Unweighted GPA": "3.9500",
  "rank": "12 / 850",
  "quartile": "1st"
}
```
