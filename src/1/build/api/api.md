# ONE API Documentation

The ONE API provides a unified interface for executing capabilities through HTTP endpoints.

## Base URL

- Production: `https://one.ie/api/1`
- Development: `http://localhost:1111/api/1`

## Authentication

Currently, the API is open and does not require authentication.

## Response Format

All API responses follow this format:

```typescript
{
  status: number;    // HTTP status code
  message: string;   // Response message
  data: unknown;     // Response data
  _one: {
    version: string;   // ONE version
    timestamp: string; // ISO timestamp
    path: string;      // API path
  }
}
```

## Endpoints

### Execute Capability

Execute a ONE capability through the API.

#### `GET /{capability}`

Execute a capability without parameters.

**Parameters:**
- `capability` (path) - The name of the capability to execute

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": { ... },
  "_one": {
    "version": "1.0.0",
    "timestamp": "2024-03-19T12:00:00Z",
    "path": "chat"
  }
}
```

#### `POST /{capability}`

Execute a capability with parameters.

**Parameters:**
- `capability` (path) - The name of the capability to execute
- Request body (JSON) - Capability parameters

**Example:**
```bash
curl -X POST https://one.ie/api/1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello ONE!"}'
```

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "response": "Hello! How can I assist you today?"
  },
  "_one": {
    "version": "1.0.0",
    "timestamp": "2024-03-19T12:00:00Z",
    "path": "chat"
  }
}
```

## Error Handling

Errors return appropriate HTTP status codes and follow the standard response format:

```json
{
  "status": 400,
  "message": "Invalid request: Missing required parameter",
  "data": null,
  "_one": {
    "version": "1.0.0",
    "timestamp": "2024-03-19T12:00:00Z",
    "path": "error"
  }
}
```

Common status codes:
- `200` - Success
- `400` - Invalid request
- `404` - Capability not found
- `500` - Internal server error

## CORS

The API supports CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type` 