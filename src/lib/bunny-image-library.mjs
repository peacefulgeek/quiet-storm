/**
 * Bunny CDN Image Library — quiet-storm
 * 
 * 40 pre-generated WebP images at /library/lib-01.webp through /library/lib-40.webp
 * On publish: randomly select one, download it, re-upload to /images/{slug}.webp
 * Gives Google a unique indexable URL per article.
 * 
 * HARDCODED CREDENTIALS (per spec). DO NOT move to env vars.
 */

const BUNNY_STORAGE_ZONE = 'quiet-storm';
const BUNNY_API_KEY = '4f79f1de-6894-4de4-962e830a70ee-cf58-40a0';
const BUNNY_PULL_ZONE = 'https://quiet-storm.b-cdn.net';
const BUNNY_HOSTNAME = 'ny.storage.bunnycdn.com';

/**
 * Assign a hero image to an article by copying a library image to /images/{slug}.webp
 * @param {string} slug - The article slug
 * @returns {string} The CDN URL of the assigned hero image
 */
async function assignHeroImage(slug) {
  const sourceFile = `lib-${String(Math.floor(Math.random() * 40) + 1).padStart(2, '0')}.webp`;
  const destFile = `${slug}.webp`;

  try {
    const sourceUrl = `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
    const downloadRes = await fetch(sourceUrl);
    if (!downloadRes.ok) throw new Error(`Download failed: ${downloadRes.status}`);
    const imageBuffer = await downloadRes.arrayBuffer();

    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/images/${destFile}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': 'image/webp' },
      body: imageBuffer,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    console.log(`[bunny-lib] Assigned ${sourceFile} -> /images/${destFile}`);
    return `${BUNNY_PULL_ZONE}/images/${destFile}`;
  } catch (err) {
    console.error(`[bunny-lib] Error assigning image for ${slug}:`, err.message);
    // Fallback: link directly to the library image
    return `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
  }
}

export { assignHeroImage, BUNNY_PULL_ZONE, BUNNY_STORAGE_ZONE, BUNNY_API_KEY, BUNNY_HOSTNAME };
