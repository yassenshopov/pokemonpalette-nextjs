const fs = require('fs');
const path = require('path');
const https = require('https');

// Generate all Pokemon IDs from 1 to 1025 (covers all generations up to Gen 9)
const POKEMON_IDS = Array.from({ length: 1025 }, (_, i) => i + 1);

const POKEMON_IMAGES_DIR = path.join(__dirname, '../public/images/pokemon');

// Ensure the directory exists
if (!fs.existsSync(POKEMON_IMAGES_DIR)) {
  fs.mkdirSync(POKEMON_IMAGES_DIR, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });

        file.on('error', err => {
          fs.unlink(filepath, () => {}); // Delete the file if there was an error
          reject(err);
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

async function downloadPokemonImages() {
  console.log('🚀 Starting Pokemon image download...');
  console.log(`📁 Target directory: ${POKEMON_IMAGES_DIR}`);
  console.log(`🎯 Pokemon IDs: ${POKEMON_IDS.join(', ')}`);

  const results = {
    success: 0,
    failed: 0,
    errors: [],
  };

  const downloadPromises = POKEMON_IDS.map(async id => {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const filepath = path.join(POKEMON_IMAGES_DIR, `${id}.png`);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped: ${id}.png (already exists)`);
      results.success++;
      return;
    }

    try {
      await downloadImage(url, filepath);
      results.success++;
    } catch (error) {
      console.error(`❌ Failed to download Pokemon ${id}:`, error.message);
      results.failed++;
      results.errors.push({ id, error: error.message });
    }
  });

  await Promise.all(downloadPromises);

  console.log('\n📊 Download Summary:');
  console.log(`✅ Successfully downloaded: ${results.success}`);
  console.log(`❌ Failed downloads: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(({ id, error }) => {
      console.log(`  - Pokemon ${id}: ${error}`);
    });
  }

  console.log('\n🎉 Pokemon image download completed!');
  console.log(`💡 You can now use local paths like '/images/pokemon/25.png' in your components.`);
}

// Run the download
downloadPokemonImages().catch(console.error);
