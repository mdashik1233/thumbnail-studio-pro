export async function onRequestGet({ request, env }) {
  const key = env.PIXABAY_API_KEY;

  if (!key) {
    return Response.json({
      error: "PIXABAY_API_KEY is not configured."
    }, { status: 500 });
  }

  const q = new URL(request.url).searchParams.get("q") || "";

  if (!q.trim()) {
    return Response.json({
      error: "Enter a search phrase."
    }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      key,
      q: q.trim().slice(0, 100),
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      per_page: "25"
    });

    const response = await fetch(
      "https://pixabay.com/api/?" + params
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        error: "Pixabay image search failed."
      }, { status: 502 });
    }

    const items = (data.hits || []).map(item => ({
      largeImageURL: item.largeImageURL,
      tags: item.tags
    }));

    return Response.json({ items });

  } catch (error) {
    return Response.json({
      error: "Image search failed: " + error.message
    }, { status: 500 });
  }
}
