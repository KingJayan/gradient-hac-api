---
title: POST /api/classes
description: Returns the list of current classes.
sidebar:
  label: classes
  order: 3
---

Returns the student's current class names.

```bash
curl -X POST https://your-deployment.vercel.app/api/classes \
  -H "X-HAC-Link: https://accesscenter.roundrockisd.org" \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
["AP Calculus AB", "AP English III", "Chemistry"]
```
