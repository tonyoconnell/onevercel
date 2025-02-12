import type { APIRoute } from 'astro';
import { NewsManager } from '../news';
import path from 'path';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const category = url.searchParams.get('category') || '';
    const search = url.searchParams.get('search') || '';
    
    const newsManager = new NewsManager(path.join(process.cwd(), 'blocks/1/news.yaml'));
    
    // Get paginated and filtered news
    const result = await newsManager.getPaginatedNews(page, 6, {
      category,
      search
    });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 