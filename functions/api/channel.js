export async function onRequestGet({ request, env }) {
  const key = env.YOUTUBE_API_KEY;
  if (!key) {
    return Response.json({
      error: "YOUTUBE_API_KEY is not configured."
    }, { status: 500 });
  }

  const url = new URL(request.url).searchParams.get("url") || "";
  const handle = url.match(/@([A-Za-z0-9._-]+)/)?.[1];
  const channelId = url.match(/(UC[\w-]{20,})/)?.[1];

  if (!handle && !channelId) {
    return Response.json({
      error: "Enter a valid YouTube channel URL or @handle."
    }, { status: 400 });
  }

  try {
    let id = channelId;

    if (!id) {
      const p = new URLSearchParams({
        part: "id,snippet",
        forHandle: handle,
        key
      });

      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?" + p
      );
      const data = await res.json();

      if (!res.ok || !data.items?.length) {
        return Response.json({
          error: "Channel not found."
        }, { status: 404 });
      }

      id = data.items[0].id;
    }

    const cp = new URLSearchParams({
      part: "snippet,contentDetails",
      id,
      key
    });

    const cr = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?" + cp
    );
    const cd = await cr.json();

    if (!cr.ok || !cd.items?.length) {
      return Response.json({
        error: "Could not read channel details."
      }, { status: 502 });
    }

    const ch = cd.items[0];
    const playlist = ch.contentDetails.relatedPlaylists.uploads;

    const pp = new URLSearchParams({
      part: "snippet",
      playlistId: playlist,
      maxResults: "25",
      key
    });

    const pr = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?" + pp
    );
    const pd = await pr.json();

    if (!pr.ok) {
      return Response.json({
        error: "YouTube API request failed."
      }, { status: 502 });
    }

    const items = (pd.items || []).map(x => ({
      title: x.snippet.title,
      videoId: x.snippet.resourceId.videoId
    }));

    return Response.json({
      channelTitle: ch.snippet.title,
      items
    });

  } catch (e) {
    return Response.json({
      error: "Channel lookup failed: " + e.message
    }, { status: 500 });
  }
}
