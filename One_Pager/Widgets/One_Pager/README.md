# One Pager — Widget Documentation

> **Platform:** Zoho Creator widget
> **Zoho Creator App:** `research-application-env` (research environment)
> **Entry file:** `app/index.html` → compiled **React** bundle (`app/static/js/main.*.js`)
> **Browser tab title:** "Analyst Report Widget"

---

## 1. Purpose

The **One Pager** widget composes and manages a **single-page (A4) company summary/report**. A company's information is laid out across **8 editable content blocks** (header + rich-text content, some with an image), which can be edited inline, previewed as a formatted A4 sheet, and exported/printed to PDF.

This widget is a compiled React app (Create React App build output).

---

## 2. Where It Runs & What It Touches

| Item | Value |
|------|-------|
| **Zoho Creator app** | `research-application-env` |
| **SDK** | Zoho Creator Widget SDK **2.0** (loaded in `index.html`) |
| **Opened via URL param** | `recordId` — selects the company record to load |
| **React mount point** | `<div id="root">` in `index.html` |

### Forms / reports / pages (from strings in the bundle)
| Name | Type | Role |
|------|------|------|
| `One_Page_Module` | form/module | Data model for the one-pager record |
| `One_Page_Module_Report` | report | Read/write company one-pager data |
| `My_One_Pagers_Page` / `My_One_Pagers` | page | Navigation / list view |

---

## 3. User Roles & Permissions

No explicit role logic was found in the bundle. Access is governed by **Zoho Creator's native record permissions**; the widget operates on a single record scoped by the `recordId` parameter.

---

## 4. Workflow

1. **Load** — widget opens inside Creator with `?recordId=<id>`; React reads it and fetches the record from `One_Page_Module_Report`.
2. **Edit** — user edits any of the 8 blocks inline (header + rich-text content); some blocks support an image and/or a dropdown option. Editing toolbars appear on hover.
3. **Preview** — renders the formatted A4 one-pager layout.
4. **Export/Print** — triggers print-to-PDF; `Print_Layout_HTML` stores the generated printable HTML.
5. **Save/Submit** — persists changes back to the Creator record. Detected actions include save, draft, submit, preview, and download/pdf.

---

## 5. Key Features & UI

- **8-block structured layout** on a fixed **A4 sheet** (~1123 × 795 px), arranged in a **three-column grid** (~353 px columns).
- **Rich-text editing via Quill v2.0.3** (Snow theme) with the *quill-better-table* plugin and resizable table cells — headings, lists, links, tables, code blocks, pixel-size picker.
- **Image blocks** (Blocks 5, 6, 8): upload/remove, stored as Creator file attachments with public-link generation; object URLs for local preview.
- **Dropdown options** on Blocks 5 & 6 (`Block_5_Option`, `Block_6_Option`).
- **Modals** for validation warnings/errors and confirmations.
- **Footer actions** — Discard (red), Draft (orange), Submit (green), Preview (blue); disabled during API calls. Color scheme: navy `#0e2e5c`, accent gray `#f0f0f0`.

---

## 6. Data Model (field names found in the bundle)

**Company-level:** `Company_Name`, `Company_ID`, `Bloomberg_Ticker`.

**Per block (1–8):** `Block_N_Heading` (display label), `Block_N_Header` (title), `Block_N_Content` (rich HTML). Image fields on `Block_5_Image`, `Block_6_Image`, `Block_8_Image`; option fields on `Block_5_Option`, `Block_6_Option`.

**Output:** `Print_Layout_HTML` (generated printable HTML), `Print_One_Pager` (print/export field).

---

## 7. Dependencies & Build

| Dependency | Notes |
|------------|-------|
| **React** (production build) | via Create React App; MIT (see `*.js.LICENSE.txt`) |
| **Quill 2.0.3** + quill-better-table | rich-text editing & tables |
| **Zoho Creator Widget SDK 2.0** | `https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js` |

**Build layout** (Create React App output):
```
app/
├── index.html                     ← HTML shell, mounts #root
├── asset-manifest.json            ← active bundle: main.7bcf1742.js + main.49d60465.css
├── plugin-manifest.json           ← { service: WIDGET, location: index.html }
├── translations/en.json           ← empty
└── static/
    ├── js/  main.7bcf1742.js (+ .LICENSE.txt), main.9758bc93.js (+ .LICENSE.txt)
    └── css/ main.49d60465.css (+ several other hashed .css files)
```
The **root** `plugin-manifest.json` is `{ "service": "CREATOR" }`; the **app** `plugin-manifest.json` points the widget at `index.html`. `asset-manifest.json` shows the active files are `main.7bcf1742.js` / `main.49d60465.css`.

---

## 8. Setup / Deployment Notes

1. Ensure `One_Page_Module` / `One_Page_Module_Report` exist in `research-application-env` with the block fields above.
2. Embed/link the widget so it opens with **`?recordId=<id>`** — without it the widget has no record to load.
3. Deploy the whole `app/` directory (it's a static SPA served from `index.html`).
4. **To change anything in this widget you need the original React source**, then rebuild:
   ```
   npm install
   npm run build      # produces the app/ static bundle
   ```
   then re-upload.
