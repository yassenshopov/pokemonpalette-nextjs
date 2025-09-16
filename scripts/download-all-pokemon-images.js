const fs = require('fs');
const path = require('path');
const https = require('https');

const MAX_ID = 10250; // Covers all forms, megas, gmax, etc.
const BASE_DIR = path.join(__dirname, '../public/images/pokemon');

const spriteVariants = [
  {
    type: 'front',
    subdir: 'front',
    url: id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  },
  {
    type: 'front',
    subdir: 'front/shiny',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,
  },
  {
    type: 'front',
    subdir: 'front/female',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/${id}.png`,
  },
  {
    type: 'front',
    subdir: 'front/shiny/female',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/female/${id}.png`,
  },
  {
    type: 'back',
    subdir: 'back',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
  },
  {
    type: 'back',
    subdir: 'back/shiny',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`,
  },
  {
    type: 'back',
    subdir: 'back/female',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/female/${id}.png`,
  },
  {
    type: 'back',
    subdir: 'back/shiny/female',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/female/${id}.png`,
  },
];

const artworkVariants = [
  {
    subdir: 'official-artwork',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  },
  {
    subdir: 'official-artwork/shiny',
    url: id =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`,
  },
];

const formsDir = 'forms';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(filepath, () => {});
          return resolve(false); // Not found, skip
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
        file.on('error', err => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

async function main() {
  console.log('🚀 Starting full Pokémon image download...');
  let success = 0,
    skipped = 0,
    failed = 0;
  // Ensure all directories exist
  for (const variant of spriteVariants) ensureDir(path.join(BASE_DIR, variant.subdir));
  for (const variant of artworkVariants) ensureDir(path.join(BASE_DIR, variant.subdir));
  ensureDir(path.join(BASE_DIR, formsDir));

  for (let id = 1; id <= MAX_ID; id++) {
    // Sprite variants
    for (const variant of spriteVariants) {
      const filePath = path.join(BASE_DIR, variant.subdir, `${id}.png`);
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }
      const url = variant.url(id);
      try {
        const ok = await downloadImage(url, filePath);
        if (ok) {
          console.log(`✅ ${variant.subdir}/${id}.png`);
          success++;
        } else {
          skipped++;
        }
      } catch (e) {
        failed++;
        console.error(`❌ ${variant.subdir}/${id}.png: ${e.message}`);
      }
    }
    // Official artwork
    for (const variant of artworkVariants) {
      const filePath = path.join(BASE_DIR, variant.subdir, `${id}.png`);
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }
      const url = variant.url(id);
      try {
        const ok = await downloadImage(url, filePath);
        if (ok) {
          console.log(`✅ ${variant.subdir}/${id}.png`);
          success++;
        } else {
          skipped++;
        }
      } catch (e) {
        failed++;
        console.error(`❌ ${variant.subdir}/${id}.png: ${e.message}`);
      }
    }
    // Forms (IDs > 10000)
    if (id > 10000) {
      const filePath = path.join(BASE_DIR, formsDir, `${id}.png`);
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      try {
        const ok = await downloadImage(url, filePath);
        if (ok) {
          console.log(`✅ forms/${id}.png`);
          success++;
        } else {
          skipped++;
        }
      } catch (e) {
        failed++;
        console.error(`❌ forms/${id}.png: ${e.message}`);
      }
    }
  }
  console.log('\n📊 Download Summary:');
  console.log(`✅ Downloaded: ${success}`);
  console.log(`⏭️  Skipped (already exists or not found): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('🎉 All done!');
}

main().catch(console.error);
