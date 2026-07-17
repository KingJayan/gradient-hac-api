---
title: POST /api/reportcard
description: Returns report card grades.
sidebar:
  label: reportcard
  order: 6
---

Returns the report card as a headers array plus rows of cells.

```bash
curl -X POST https://your-deployment.vercel.app/api/reportcard \
  -u STUDENT_ID:PASSWORD
```

## Response

```json
{
  "headers": ["Course", "Description", "Period", "Teacher", "Room", "1st", "2nd", "3rd", "Exam1", "Sem1", "4th", "5th", "6th", "Exam2", "Sem2", "CND1", "CND2", "CND3", "CND4", "CND5", "CND6"],
  "data": [
    ["MATH0101", "AP Calculus AB", "2", "Smith, John", "204", "98", "97", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
  ]
}
```
