# Error Handling

## Standard API Error Response

```json
{
  "success": false,
  "message": "Human-readable error description",
  "code": "ERROR_CODE",
  "errors": []
}
```

## Standard API Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ENTRY` | 409 | Email already registered |
| `ACCOUNT_SUSPENDED` | 403 | User account suspended |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Rules

1. All controllers use centralized error handler via `next(error)`
2. Never expose stack traces in production
3. Validation errors include field-level detail in `errors[]`
4. Database errors are caught and transformed to generic messages
5. Mongoose validation errors are mapped to `VALIDATION_ERROR`
