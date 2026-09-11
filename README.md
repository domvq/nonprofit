# [Organization Name] — EMS Education Website

A static, multi-page site. Every page is now fully self-contained —
CSS and JS are inlined directly into each `.html` file, so there's no
`assets` folder to keep track of and no way for a missing folder to
break the styling.

## Pages
- `index.html` — Home / About
- `education.html` — Standard EMS education (EMR/EMT/AEMT/Paramedic overview)
- `treatments.html` — Treatment & medication reference tables
- `ecg.html` — ECG reading guide
- `ai-innovation.html` — AI & innovation in EMS, with cited sources
- `cases.html` — Real case studies (currently placeholders — see below)
- `resources.html` — Study guides, Fisdap/Quizlet, and your three apps
- `contact.html` — Contact + "contact a certified EMT" section

## Deploying to GitHub Pages
1. Create a new GitHub repository (public).
2. Upload/add all 8 `.html` files to the repo (root level — no folders needed).
3. Push to the `main` branch.
4. In the repo, go to **Settings → Pages**, set **Source** to `main` branch,
   root folder, and save.
5. GitHub will give you a URL like `https://yourusername.github.io/reponame/`.
   Give it 30–90 seconds the first time.

## Before you publish — placeholder checklist
Search each file for `[Organization Name]` and the following, and replace them:
- [ ] `[Organization Name]` — appears in every page's title, header, and footer
- [ ] `info@example.org` and `ask@example.org` — real contact emails
- [ ] `https://calendly.com/your-link-here` — a real scheduling link (or remove it)
- [ ] `[Street address, City, State ZIP]` and the social links (`contact.html`)
- [ ] The three case study cards in `cases.html` — replace with real, cited cases
- [ ] The bracketed `[X]` stats on the homepage stat strip
- [ ] The founding story / mission copy on `index.html` — personalize if you'd like

## Notes
- Each page has its own `<style>` block (identical CSS repeated per file). That
  means editing the design now means editing it in all 8 files — if that
  becomes annoying, the fix is going back to one shared `assets/style.css`
  and making sure it's uploaded alongside the HTML files.
- Fonts (Plus Jakarta Sans) load from Google Fonts via CDN — that part still
  needs an internet connection to render correctly.
- The treatment/medication and scope-of-practice content is based on the
  national model and is for study purposes — it explicitly tells readers to
  defer to their state and medical director, since scope varies.
