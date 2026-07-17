---
title: POST /api/ipr
description: Returns the interim progress report.
sidebar:
  label: ipr
  order: 7
---

Returns the interim progress report (IPR) as a headers row plus data rows.

```bash
curl -X POST https://your-deployment.vercel.app/api/ipr \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "headers": ["Course", "Description", "Period", "Teacher", "Room", "Grade"],
  "data": [
    ["MATH0101", "AP Calculus AB", "2", "Smith, John", "204", "98"]
  ]
}
```

Returns `null` if no progress report is available.
