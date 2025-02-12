---
title: Production Deployment
description: Learn how to deploy ONE applications to production environments
date: 2024-02-02
section: Deployment
order: 1
---

# Deploying to Production

This guide covers everything you need to know about deploying ONE applications to production environments, including setup, optimization, and monitoring.

## Deployment Options

### 1. Vercel (Recommended)

The simplest way to deploy your ONE application:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel deploy
```

#### Environment Setup
```env
# .env.production
OPENAI_API_KEY=your_production_key
EDGE_CONFIG=your_edge_config
```

#### Configuration
```typescript
// vercel.json
{
  "regions": ["all"],
  "env": {
    "EDGE_RUNTIME": "1"
  },
  "buildCommand": "pnpm build",
  "outputDirectory": "dist"
}
```

### 2. Cloudflare Pages

```bash
# Install Wrangler
pnpm add -g wrangler

# Deploy
wrangler deploy
```

#### Configuration
```toml
# wrangler.toml
name = "your-one-app"
type = "webpack"
account_id = "your_account_id"
workers_dev = true
route = "your-domain.com/*"
zone_id = "your_zone_id"

[env.production]
vars = { ENVIRONMENT = "production" }
```

### 3. Custom Server

```typescript
// server.js
import { handler } from './dist/server/entry.mjs';
import express from 'express';
import compression from 'compression';

const app = express();
app.use(compression());
app.use(express.static('dist/client'));
app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Performance Optimization

### 1. Edge Runtime

Enable edge functions for optimal performance:

```typescript
// src/pages/api/chat.ts
export const config = {
  runtime: 'edge',
  regions: ['all'],
};

export default async function handler(req: Request) {
  // Your chat API logic
}
```

### 2. Caching Strategy

```typescript
// src/lib/cache.ts
import { LRUCache } from 'lru-cache';

export const responseCache = new LRUCache({
  max: 500,  // Maximum items
  maxAge: 1000 * 60 * 60,  // 1 hour
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

// Usage
const getCachedResponse = async (key: string) => {
  if (responseCache.has(key)) {
    return responseCache.get(key);
  }
  
  const response = await generateResponse(key);
  responseCache.set(key, response);
  return response;
};
```

### 3. Asset Optimization

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    minify: true,
    splitting: true,
  },
  image: {
    service: 'astro/assets/services/sharp',
  },
});
```

## Security Measures

### 1. Environment Variables

```typescript
// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

### 2. API Rate Limiting

```typescript
// src/middleware/rateLimiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function rateLimiter(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  const { success, limit, remaining, reset } = await ratelimit.limit(
    `ratelimit_${ip}`
  );

  return { success, headers: {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  }};
}
```

### 3. Content Security Policy

```typescript
// src/middleware/security.ts
export const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## Monitoring

### 1. Error Tracking

```typescript
// src/lib/errorTracking.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const trackError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    extra: context
  });
};
```

### 2. Performance Monitoring

```typescript
// src/lib/metrics.ts
import { Metrics } from '@opentelemetry/api';

export const metrics = {
  chatLatency: new Metrics.Counter('chat_latency', {
    description: 'Chat response latency in milliseconds'
  }),
  requestCount: new Metrics.Counter('request_count', {
    description: 'Total number of requests'
  })
};

// Usage
metrics.chatLatency.add(responseTime);
metrics.requestCount.add(1);
```

## Health Checks

```typescript
// src/pages/api/health.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    openai: await checkOpenAI()
  };

  const isHealthy = Object.values(checks).every(status => status === 'healthy');

  return new Response(JSON.stringify({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  }), {
    status: isHealthy ? 200 : 503,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

## Scaling Considerations

1. **Database Connections**
   - Use connection pooling
   - Implement retry logic
   - Monitor connection limits

2. **Memory Management**
   - Implement proper garbage collection
   - Monitor memory usage
   - Use streaming for large responses

3. **Load Balancing**
   - Distribute traffic evenly
   - Handle failover scenarios
   - Monitor server health

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and dependencies
   pnpm clean
   rm -rf node_modules
   pnpm install
   ```

2. **API Issues**
   - Verify environment variables
   - Check API key permissions
   - Monitor rate limits

3. **Performance Problems**
   - Enable edge functions
   - Implement caching
   - Optimize assets
   - Monitor response times

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build process verified
- [ ] Security headers implemented
- [ ] Rate limiting enabled
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Health checks configured
- [ ] Backup strategy in place
- [ ] SSL certificates installed
- [ ] DNS records updated

## Next Steps

- [Monitoring Setup](/docs/deployment/monitoring)
- [Scaling Guide](/docs/deployment/scaling)
- [Security Best Practices](/docs/deployment/security)

Need help? Check our [FAQ](/docs/faq) or contact [support](mailto:support@one.ie).