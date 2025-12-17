const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Find all [id]/route.ts files
const files = glob.sync('src/app/api/**/\[id\]/route.ts')

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')
  let modified = false

  // Replace params type signature
  const oldPattern = /{ params }: { params: { id: string } }/g
  const newType = '{ params }: { params: Promise<{ id: string }> }'
  
  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newType)
    modified = true
  }

  // Update function bodies to await params
  // Pattern: function starts, then we need to add "const { id } = await params" after await requireAdmin() or similar
  const functionPattern = /(export async function (GET|POST|PUT|PATCH|DELETE)\([^)]+\)\s*\{[^}]*?)(await requireAdmin\(\)|const session = await|const body = await)/g
  
  content = content.replace(functionPattern, (match, funcStart, method, nextLine) => {
    // Check if params.id is used in the function
    if (content.includes('params.id')) {
      // Add await params after function start, before the next line
      return funcStart + `    const { id } = await params\n    ` + nextLine
    }
    return match
  })

  // Replace all instances of params.id with id
  if (content.includes('params.id')) {
    content = content.replace(/params\.id/g, 'id')
    modified = true
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8')
    console.log(`Updated ${file}`)
  }
})

console.log('Done!')

