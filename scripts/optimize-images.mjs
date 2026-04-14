import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, relative } from 'path'

const ROOT = new URL('../public/images', import.meta.url).pathname

// Max width by folder pattern
function maxWidthFor(filePath) {
  const rel = filePath.toLowerCase()
  if (rel.includes('/home/hero') || rel.includes('/seva/hero') || rel.includes('/events/hero')) return 1920
  if (rel.includes('/home/') || rel.includes('/events/') || rel.includes('/about ')) return 1200
  if (rel.includes('/deities/')) return 900
  if (rel.includes('/managenment/') || rel.includes('/contact')) return 900
  return 1200
}

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...(await findImages(full)))
    } else if (/\.(jpe?g|png|webp)$/i.test(e.name)) {
      files.push(full)
    }
  }
  return files
}

async function optimizeImage(filePath) {
  const before = (await stat(filePath)).size
  const maxWidth = maxWidthFor(filePath)
  const ext = extname(filePath).toLowerCase()
  const isJpeg = ext === '.jpg' || ext === '.jpeg'

  const meta = await sharp(filePath).metadata()
  const needsResize = (meta.width ?? 0) > maxWidth

  // Skip if already small enough and reasonably sized
  if (!needsResize && before < 500_000) return null

  const pipeline = sharp(filePath)
    .rotate() // auto-orient from EXIF
    .resize({ width: maxWidth, withoutEnlargement: true })

  const buf = isJpeg || ext === '.jpg'
    ? await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
    : ext === '.png'
      ? await pipeline.png({ compressionLevel: 8 }).toBuffer()
      : await pipeline.webp({ quality: 82 }).toBuffer()

  if (buf.length < before) {
    await sharp(buf).toFile(filePath)
    return { filePath, before, after: buf.length }
  }
  return null
}

const files = await findImages(ROOT)
console.log(`Found ${files.length} images (${ROOT})`)

let totalBefore = 0
let totalAfter = 0
let count = 0

for (const f of files) {
  try {
    const result = await optimizeImage(f)
    if (result) {
      const saving = ((1 - result.after / result.before) * 100).toFixed(1)
      const rel = relative(ROOT, result.filePath)
      console.log(`  ✓ ${rel}: ${(result.before/1024/1024).toFixed(1)}MB → ${(result.after/1024/1024).toFixed(1)}MB (-${saving}%)`)
      totalBefore += result.before
      totalAfter += result.after
      count++
    }
  } catch (err) {
    console.error(`  ✗ ${relative(ROOT, f)}: ${err.message}`)
  }
}

if (count > 0) {
  const totalSaving = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(`\nOptimized ${count} files`)
  console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (-${totalSaving}%)`)
} else {
  console.log('All images already optimized.')
}
