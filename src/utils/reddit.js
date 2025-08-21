/**
 * Reach out to the reddit API, and get the first page of results from
 * r/aww. Filter out posts without readily available images or videos,
 * and return a random result.
 * @returns The url of an image or video which is cute.
 */
export async function getCuteUrl() {
  const response = await fetch(redditUrl, {
    headers: {
      'User-Agent': 'sundabot-discord-bot',
    },
  });

  if (!response.ok) {
    let errorText = `Error fetching ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) errorText += `\n\n${error}`;
    } catch {
      // ignore
    }
    throw new Error(errorText);
  }

  const data = await response.json();
  const posts = data.data.children
    .map((child) => {
      const post = child.data;
      if (!post) return null;
      if (post.is_gallery) return null; // skip galleries for now
      return (
        post.media?.reddit_video?.fallback_url ||
        post.secure_media?.reddit_video?.fallback_url ||
        post.url
      );
    })
    .filter((url) => !!url && url.startsWith('http'));

  if (posts.length === 0) {
    throw new Error('No valid posts found in /r/aww');
  }

  const randomIndex = Math.floor(Math.random() * posts.length);
  return posts[randomIndex];
}

export const redditUrl = 'https://www.reddit.com/r/aww/hot.json';
