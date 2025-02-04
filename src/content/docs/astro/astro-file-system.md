---
title: File System Operations in Astro
description: Learn how to handle file operations in Astro using Node.js
date: 2024-02-02
section: Development
order: 1
---

# File System Operations in Astro

To handle file operations in an Astro project using the Node.js adapter, follow these steps:

1. **Set Up Your Astro Project**:
   ```bash
   npm create astro@latest
   cd your-project-directory
   npm install
   ```

2. **Add the Node.js Adapter**:
   ```bash
   npx astro add node
   ```

3. **Configure the Adapter**:
   Update your `astro.config.mjs`:
   ```javascript
   import { defineConfig } from 'astro/config';
   import node from '@astrojs/node';

   export default defineConfig({
     output: 'server',
     adapter: node(),
   });
   ```

4. **Create an API Endpoint**:
   Create a file at `src/pages/api/save.ts`:
   ```typescript
   import type { APIRoute } from 'astro';
   import { writeFile } from 'fs/promises';
   import { join } from 'path';

   export const POST: APIRoute = async ({ request }) => {
     try {
       const data = await request.formData();
       const content = data.get('content');
       
       if (import.meta.env.PROD) {
         // Handle production environment
         return new Response(JSON.stringify({
           success: true,
           message: 'Content saved to production storage'
         }), {
           status: 200,
           headers: { 'Content-Type': 'application/json' }
         });
       }

       // Local development - save to public directory
       const filePath = join(process.cwd(), 'public', 'saved-content.txt');
       await writeFile(filePath, content as string);

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
   ```

5. **Create a Frontend Interface**:
   Create a page at `src/pages/save.astro` to handle file saving:
   ```astro
   ---
   import Layout from "../layouts/Layout.astro";

   let saveStatus = '';
   let savedPath = '';

   if (Astro.request.method === 'POST') {
     try {
       const data = await Astro.request.formData();
       const response = await fetch(`${Astro.url.origin}/api/save`, {
         method: 'POST',
         body: data
       });
       
       const result = await response.json();
       if (result.success) {
         saveStatus = 'success';
         savedPath = import.meta.env.PROD ? 'Production Storage' : '/public/saved-content.txt';
       } else {
         throw new Error(result.message);
       }
     } catch (error) {
       console.error('Error saving file:', error);
       saveStatus = 'error';
     }
   }
   ---

   <Layout title="Save Content">
     <section class="container mx-auto p-4">
       <div class="rounded-lg border bg-card p-8 w-full">
         <h2 class="text-2xl font-bold mb-4">Save Content</h2>
         
         {saveStatus === 'success' && (
           <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
             <p>Content saved successfully!</p>
             <p class="text-sm">Saved to: {savedPath}</p>
           </div>
         )}

         <form method="POST" class="space-y-4">
           <div class="space-y-2">
             <label for="content">Content to Save</label>
             <textarea 
               id="content"
               name="content"
               class="w-full min-h-[400px] rounded-md border p-2"
               placeholder="Enter content..."
             ></textarea>
           </div>
           
           <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
             Save Content
           </button>
         </form>
       </div>
     </section>
   </Layout>
   ```

6. **Important Considerations**:
   - Always use `fs/promises` for modern async file operations
   - Handle both development and production environments appropriately
   - Implement proper error handling
   - Use absolute paths with `path.join()` for file operations
   - Ensure proper permissions in production environments

7. **Running the Project**:
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   node dist/server/entry.mjs
   ```