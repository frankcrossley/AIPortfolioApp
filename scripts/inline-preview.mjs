// Bundles dist-preview into a single self-contained HTML file (CSS + JS inlined).
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist-preview'
let html = readFileSync(join(dir, 'index.html'), 'utf8')

html = html.replace(/<link rel="stylesheet"[^>]*href="\.?\/?([^"]+\.css)"[^>]*>/g, (_, f) => `<style>${readFileSync(join(dir, f), 'utf8')}</style>`)
html = html.replace(/<script type="module"[^>]*src="\.?\/?([^"]+\.js)"[^>]*><\/script>/g, (_, f) => {
  const js = readFileSync(join(dir, f), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">${js}</script>`
})
// The artifact host supplies the document skeleton, so emit just the page fragment.
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]).join('\n')
const fragment = [
  '<title>Revelo</title>',
  pick(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g),
  pick(/<style>[\s\S]*?<\/style>/g),
  '<div id="root"></div>',
  pick(/<script type="module">[\s\S]*?<\/script>/g),
].join('\n')

writeFileSync(join(dir, 'revelo-preview.html'), fragment)
html = fragment
console.log(`wrote ${dir}/revelo-preview.html (${(html.length / 1024).toFixed(0)} KB)`)
