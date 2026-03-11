const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.midianews.com.br/storage/webdisco/2022/03/18/outras/e47481ba93972c3d5964860b01648937.jpg';
const dest = path.join(__dirname, 'public', 'bope.jpg');

fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'https://www.midianews.com.br/'
  }
}, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Image downloaded successfully!');
    });
  } else {
    console.error(`Failed to download image. Status code: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error('Error downloading image:', err.message);
});
