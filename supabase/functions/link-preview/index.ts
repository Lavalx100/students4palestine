import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

serve(async (req: Request) => {
  const { method } = req;

  // 1) Handle the CORS preflight request
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // Adjust headers as needed for your requests
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }

  // 2) Only accept POST for this function
  if (method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    // 3) Parse JSON input
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // 4) Fetch the target URL HTML
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch URL" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
    const html = await res.text();

    // 5) Minimal parse for <title>, <meta name="description">, <meta property="og:image">
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

    const data = {
      url,
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null,
      images: ogImgMatch ? [ogImgMatch[1]] : []
    };

    // 6) Return JSON with CORS
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
});
