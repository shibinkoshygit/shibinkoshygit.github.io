# shibinkoshygit.github.io

Personal portfolio of Shibin Koshy — live at <https://shibinkoshygit.github.io>.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, nothing to install.
Edit a file, commit, push — GitHub Pages republishes in about a minute.

## Files

```
index.html          Page shell and meta tags (title, description, LinkedIn preview)
js/content.js       ALL site content: text, projects, skills, links  ← edit this
js/main.js          Turns content.js into the page (rarely needs editing)
css/style.css       All styling; colours are variables at the top
assets/img/         Project images
assets/og-image.png Preview image shown when the link is shared
assets/favicon.svg  Browser tab icon
.nojekyll           Tells GitHub Pages to serve the files as-is
```

## Updating the site

Everything you'd want to change is in **`js/content.js`**.

- **Change text** — find it in `content.js`, edit, save.
- **Inline code / bold** — wrap text in `` `backticks` `` or `**asterisks**`.
- **Add a project** — copy one of the objects in `projects: [...]`, give it a new `id`, edit the fields.
- **Reorder projects** — reorder the objects in the array.
- **Change the accent colour** — edit `--accent` in both themes at the top of `css/style.css`.

Then publish:

```bash
git add -A
git commit -m "Update portfolio"
git push
```

## Preview locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Placeholders still to fill

Search `content.js` for `PLACEHOLDER`. Each one shows on the site as a dashed box until it's replaced.

| What | Where in `content.js` | Format |
|---|---|---|
| Public CV | `cv` | PDF **without phone number or street address**, saved as `assets/Shibin_Koshy_CV.pdf` |
| Photo | `photo` | Portrait 4:5, about 840×1050 px, WebP or JPG, under 150 KB |
| VR demo video | `vr-audio-feedback` → `media` | Unlisted YouTube video: `{ type: "youtube", id: "VIDEO_ID", title: "..." }` |
| Self-driving car clip | `self-driving-car` → `media` | YouTube id, or a GIF/WebP under 3 MB, about 800 px wide |
| Style-transfer images | `neural-style-transfer` → `visual` and `media` | One 16:9 before/after image, about 1400×788 px, WebP, under 200 KB |
| Paper link | `iov-routing` → `links` | `{ label: "Read the paper", url: "https://..." }` |
| Paper contribution | `iov-routing` → `contributionPlaceholder` | Replace with `contribution: "…"` (one or two sentences) |
| Warzone / Risk game | `smallerWork` | `{ title, text, meta, url? }` or delete the line |
| ZooKeeper project | `smallerWork` | `{ title, text, meta, url? }` or delete the line |

The YouTube video id is the part after `v=` in the video's URL.

### Converting images

Keep images small so the site stays fast. With `cwebp` installed (`brew install webp`):

```bash
cwebp -q 80 -resize 1400 0 input.png -o assets/img/output.webp
```
