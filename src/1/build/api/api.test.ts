import { describe, test, expect, vi, beforeEach } from 'vitest';
import { handler } from './1';
import ONE from '../1';
import { createAPIContext, createTestRequest, parseResponse } from '../tests/utils';
import { APIErrorTypes } from '../tests/utils';

describe('ONE API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Capabilities', () => {
    test('executes chat capability', async () => {
      const request = createTestRequest('chat', 'POST', {
        message: 'Hello ONE!'
      });
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data._one.path).toBe('chat');
    });

    test('executes generate capability', async () => {
      const request = createTestRequest('generate', 'POST', {
        prompt: 'Generate a test'
      });
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data._one.path).toBe('generate');
    });

    test('executes transform capability', async () => {
      const request = createTestRequest('transform', 'POST', {
        input: 'Transform this'
      });
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data._one.path).toBe('transform');
    });
  });

  describe('Request Validation', () => {
    test('validates required fields', async () => {
      const request = createTestRequest('chat', 'POST', {});
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toContain(APIErrorTypes.VALIDATION);
    });

    test('validates field types', async () => {
      const request = createTestRequest('chat', 'POST', {
        message: 123 // Should be string
      });
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toContain(APIErrorTypes.VALIDATION);
    });

    test('handles empty body', async () => {
      const request = createTestRequest('chat', 'POST');
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toContain(APIErrorTypes.VALIDATION);
    });
  });

  describe('Response Format', () => {
    test('includes all required fields', async () => {
      const request = createTestRequest('chat', 'GET');
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(data).toMatchObject({
        status: expect.any(Number),
        message: expect.any(String),
        data: expect.any(Object),
        _one: {
          version: expect.any(String),
          timestamp: expect.any(String),
          path: expect.any(String)
        }
      });
    });

    test('includes correct content type', async () => {
      const request = createTestRequest('chat', 'GET');
      const context = createAPIContext(request);
      const response = await handler(context);

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    test('includes CORS headers', async () => {
      const request = createTestRequest('chat', 'GET');
      const context = createAPIContext(request);
      const response = await handler(context);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('Error Handling', () => {
    test('handles capability not found', async () => {
      const request = createTestRequest('nonexistent');
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(404);
      expect(data.message).toContain(APIErrorTypes.NOT_FOUND);
    });

    test('handles rate limiting', async () => {
      vi.spyOn(ONE, 'executeCapability').mockRejectedValueOnce(
        new Error(APIErrorTypes.RATE_LIMIT)
      );

      const request = createTestRequest('chat');
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(429);
      expect(data.message).toContain(APIErrorTypes.RATE_LIMIT);
    });

    test('handles system maintenance', async () => {
      vi.spyOn(ONE, 'init').mockRejectedValueOnce(
        new Error(APIErrorTypes.MAINTENANCE)
      );

      const request = createTestRequest('chat');
      const context = createAPIContext(request);
      const response = await handler(context);
      const data = await parseResponse(response);

      expect(response.status).toBe(503);
      expect(data.message).toContain(APIErrorTypes.MAINTENANCE);
    });
  });
}); 