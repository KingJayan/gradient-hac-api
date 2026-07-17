---
title: POST /api/transcript
description: Returns the full transcript with GPA info.
sidebar:
  label: transcript
  order: 8
---

Returns every transcript group (year + semester) plus cumulative GPA, rank, and quartile.

```bash
curl -X POST https://your-deployment.vercel.app/api/transcript \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "2024-2025 - Semester 1": {
    "year": "2024-2025",
    "semester": "1",
    "grade": "10",
    "school": "Example High School",
    "data": [
      ["Course", "Description", "Sem1", "Sem2", "Credit"],
      ["MATH0101", "AP Calculus AB", "98", "", "0.5"]
    ],
    "credits": "3.5"
  },
  "Weighted GPA": "5.4321",
  "Unweighted GPA": "3.9500",
  "rank": "12 / 850",
  "quartile": "1st"
}
```

GPA label keys (`Weighted GPA`, etc.) come directly from the district's HAC page and may vary.
