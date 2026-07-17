---
title: POST /api/assignments
description: Returns assignments and grade categories per class.
sidebar:
  label: assignments
  order: 5
---

Returns every class with its average, assignment rows, and category rows.

```bash
curl -X POST https://your-deployment.vercel.app/api/assignments \
  -u STUDENT_ID:PASSWORD
```

## Response

Keyed by class name. `assignments` and `categories` are table rows as scraped from HAC (arrays of cell strings).

```json
{
  "AP Calculus AB": {
    "average": "98.5",
    "assignments": [
      ["Unit 3 Quiz", "10/12/2025", "10/12/2025", "Assessments", "95.00", "100.00", "", "", ""]
    ],
    "categories": [
      ["Assessments", "95.00", "100.00", "60.00", "57.00"]
    ]
  }
}
```
