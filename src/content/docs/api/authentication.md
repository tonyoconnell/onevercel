---
title: Authentication
description: Learn how to authenticate with our API and manage access tokens
date: 2024-02-02
section: API Reference
order: 1
---

# API Authentication

This guide explains how to authenticate with our API and manage your access tokens.

## Getting an API Key

1. Log in to your dashboard
2. Navigate to API Settings
3. Generate a new API key

Your API key should be kept secure and never exposed in client-side code.

## Authentication Methods

### Bearer Token

Use your API key as a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer your-api-key" \
  https://api.example.com/v1/data
```

### Query Parameter

For testing only, you can pass the API key as a query parameter:

```bash
curl https://api.example.com/v1/data?api_key=your-api-key
```

⚠️ This method is not recommended for production use.

## Token Management

### Token Expiration

Access tokens expire after 24 hours. You'll need to implement token refresh:

```js
async function refreshToken() {
  const response = await fetch('/api/refresh', {
    headers: {
      'Authorization': `Bearer ${currentToken}`
    }
  });
  const { newToken } = await response.json();
  return newToken;
}
```

### Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise: Custom limits

## Security Best Practices

1. Never share your API key
2. Implement token rotation
3. Use environment variables
4. Monitor token usage
5. Implement proper error handling

## Next Steps

- [API Endpoints Reference](/docs/api/endpoints)
- [Error Handling](/docs/api/errors)
- [Rate Limiting Details](/docs/api/rate-limits)