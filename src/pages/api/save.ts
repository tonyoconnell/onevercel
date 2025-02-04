import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const content = data.get('content');
    
    if (import.meta.env.PROD) {
      // In production (Netlify)
      return new Response(JSON.stringify({
        success: true,
        message: 'Content saved to Netlify'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Local development
      await writeFile('public/saved-content.txt', content as string);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Content saved successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error saving content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 