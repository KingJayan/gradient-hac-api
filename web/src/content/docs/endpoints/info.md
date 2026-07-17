---
title: POST /api/info
description: Returns student registration info.
sidebar:
  label: info
  order: 2
---

Returns student registration details.

```bash
curl -X POST https://your-deployment.vercel.app/api/info \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "name": "Jane Doe",
  "grade": "11",
  "school": "Example High School",
  "dob": "1/1/2009",
  "counselor": "John Smith",
  "language": "English",
  "cohort-year": "2027"
}
```
