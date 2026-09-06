// Keep the static gallery available without JavaScript or a client-side fetch.
// Run after updating data.json: node scripts/render-works.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const works = JSON.parse(readFileSync(new URL('data.json', root), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const order = [8, 13, 1, 2, 3, 4, 7, 6, 10, 5, 12, 9];
const rank = work => order.includes(work.id) ? order.indexOf(work.id) : order.length + work.id;
const gallery = works.filter(work => work.id !== 11).sort((a, b) => rank(a) - rank(b));
const cards = gallery.map((work, i) => {
  const date = work.date.trim();
  const href = escape(work.linkUrl);
  const title = escape(work.title);
  const width = work.id === 9 ? 1919 : 1920;
  const height = work.id === 9 ? 1008 : 1080;
  return `        <article class="work" id="work-${work.id}">
          <span class="work-number" aria-hidden="true">${String(i + 2).padStart(2, '0')}</span>
          <div class="work-media"><a class="image-link" href="${href}" aria-label="${title} — 作品を見る">
            <img src="${escape(work.imageUrl)}" width="${width}" height="${height}" alt="${title} の一場面" loading="lazy" decoding="async">
            <span class="image-invitation">作品を見る <span aria-hidden="true">↗</span></span>
          </a></div>
          <div class="work-caption"><h3 class="work-title"><a href="${href}">${title}</a></h3><time datetime="${date}">${date.slice(0, 7).replace('-', '.')}</time></div>
        </article>`;
}).join('\n');
const path = new URL('index.html', root);
const original = readFileSync(path, 'utf8');
if (!original.includes('<!-- WORKS_START -->') || !original.includes('<!-- WORKS_END -->')) throw new Error('Gallery markers missing');
const updated = original.replace(/<!-- WORKS_START -->[\s\S]*?<!-- WORKS_END -->/, `<!-- WORKS_START -->\n${cards}\n        <!-- WORKS_END -->`)
  .replace(/id="works-count">[^<]*/, `id="works-count">/ ${works.length}`);
writeFileSync(path, updated);
console.log(`Rendered ${gallery.length} works + 1 opening work.`);
