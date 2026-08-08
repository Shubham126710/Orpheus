const { execSync } = require('child_process');

// Vercel serverless functions do not have Python installed.
// By default, youtube-dl-exec downloads the Python zip version of yt-dlp.
// On Vercel, we MUST download the standalone linux binary to avoid execution errors.
if (process.env.VERCEL || process.env.CI) {
  console.log('Vercel detected: Forcing youtube-dl-exec to download standalone linux binary...');
  execSync('YOUTUBE_DL_FILENAME=yt-dlp_linux npm rebuild youtube-dl-exec', { 
    stdio: 'inherit',
    env: { ...process.env, YOUTUBE_DL_FILENAME: 'yt-dlp_linux' }
  });
}
