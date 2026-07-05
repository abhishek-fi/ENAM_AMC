# Morning Meeting Notes — Widget Documentation

> **Platform:** Zoho Creator widget
> **Zoho Creator App:** `research-application-env`
> **Entry file:** `app/widget.html` (self-contained HTML + CSS + JS) + bundled TinyMCE under `app/libs/tinymce/`

---

## 1. Purpose

The **Morning Meeting Notes** widget lets analysts capture **rich-text notes from the daily morning meeting**, one note per company or sector, along with meeting metadata (target price, recommendation, event update, etc.). Notes can be **saved as drafts** and later **submitted** as a permanent record, images can be embedded, files attached, and previous notes for the same company are shown for context. It also records **meeting attendance** for certain roles.

---

## 2. Where It Runs & What It Touches

| Item | Value |
|------|-------|
| **Zoho Creator app** | `research-application-env` |
| **Opened via URL param** | `?meetingId=<ID>` (optional — see below) |
| **Logged-in user** | Read from `ZOHO.CREATOR.UTIL.getInitParams()` → email looked up in `My_User_Details` |

If `meetingId` is absent, the widget finds the latest meeting for the user (from `My_Morning_Meeting_Attendances`, or `All_Meeting_Details` for Analyst Admin).

### Forms & reports
| Entity | Role |
|--------|------|
| `Morning_Notes` (form) | The individual note record (rich HTML, status, images, analyst) |
| `Morning_Meeting_Notes` (form/report) | Parent record linking notes to a meeting + attendance |
| `Morning_Meeting_Notes_Master` (form/report) | Master rollup of attendees/status |
| `Company_Meeting` (form) | Structured meeting details (title, date, company, attachment) |
| `My_Morning_Notes_Drafts` (report) | The user's draft notes for the meeting |
| `My_Morning_Meeting_Notes_Report` (report) | The user's submitted notes |
| `My_Morning_Meeting_Attendances` (report) | Attendance history per analyst |
| `My_Companies` (report) | Companies assigned to the logged-in analyst |
| `Company_Universe_Report` (report) | All companies (used by Analyst Admin) |
| `My_User_Details` (report) | User profile lookup |

---

## 3. User Roles & Permissions

| Role | Behaviour |
|------|-----------|
| **Analyst** | Create/edit/submit notes for their **assigned** companies only. Reads `My_Companies` + `My_Morning_Meeting_Attendances`. |
| **Analyst Admin** | Notes across **all** companies (reads `Company_Universe_Report`); can pull the latest meeting from `All_Meeting_Details` and manage notes/attendance for any analyst. |
| **Fund Manager** | **Attendance-only** — the note-taking UI is hidden; can only record attendance via the modal. |

Profile is resolved at init from `My_User_Details` (`Profile` field). The owning analyst for a note resolves from the company's `Analyst2` field, falling back to the logged-in user.

---

## 4. Workflow

1. **Init** — resolve user (email → `My_User_Details`), read `meetingId`, preload the companies cache (parallel `My_Companies` + `Company_Universe_Report`), load meeting details, check whether the meeting is over, and render the UI per profile.
2. **Add a section** (per company/sector), pick a company → price and business rules auto-populate and previous notes load into a read-only sidebar.
3. **Fill metadata** — Target Price, Recommendation, Event Update, Portfolio Stock, New Ideas, Tag, Subject — and write the note in **TinyMCE**.
4. **Save Draft** → `Record_Status1 = "Draft"` in `Morning_Notes` (or update via `My_Morning_Notes_Drafts`); embedded images extracted, uploaded to `Image1`–`Image10`, and placeholders swapped for public URLs.
5. **Submit** → ensures/creates the parent `Morning_Meeting_Notes` and `Morning_Meeting_Notes_Master` records, writes each child `Morning_Notes` with `Record_Status1 = "Stored"` and `Submission_Date_Time`, uploads images and attachments, and hides Submit when all sections are submitted.
6. **Load Drafts** re-populates sections from `My_Morning_Notes_Drafts`.
7. **Attendance** modal creates/updates attendance on the meeting records.

---

## 5. Key Features & UI

- **Rich-text editor (TinyMCE)** — bundled locally; plugins include lists, link, image, table, fullscreen, code; base64 image-paste handling; browser-native spellcheck; PDF-safe ~700px content width.
- **Searchable Company/Sector dropdown** with live filtering and no-results messaging.
- **Multi-file upload** — up to 10 files; size limits 50 MB (web/iOS) / 5 MB (Android); per-file progress; images map to `Image1`–`Image10`, extra attachments to `additionalAttachment`.
- **Previous-notes sidebar** (read-only), with an optional "filter by Event Update" checkbox.
- **Status indicators** — "Not Saved" → "Draft Saved" badges; "Meeting is over" banner; attendance banner; Submit disabled once all sections are submitted.
- **Auto-calculated return %** = (Target − Price As On) / Price As On × 100.
- **Business rule example:** if `ENAM_Coverage = "Yes"` and `Part_of_Folio = "Yes"`, Portfolio Stock locks to "Yes".

---

## 6. Data Model (key API field names)

**`Morning_Notes`:** `Meet_Note` (rich HTML), `Record_Status1` (`Draft`/`Stored`), `Analyst`, `Edit_Access`, `Submission_Date_Time`, `Morning_Meeting_Notes` (link), `Morning_Meeting_Notes_Master` (link), `Image1`–`Image10` (files).

**Per-section metadata:** company/sector selection, `priceAsOn` (read-only), `targetPrice`, calculated return %, recommendation (Buy/Sell/Hold/Not Rated), event update, portfolio stock, new ideas, tag, subject, outlook.

**`Company_Meeting`:** `Meeting_title`, `Meeting_Date`, `Company_Name`, `Analyst_Name`, `Attachment`.

**Attendance (`Morning_Meeting_Notes` / `_Master`):** `Meeting_Detail` (link to `Company_Meeting`), `Analyst_Name`, `Have_you_attended_today_s_meeting` (Yes/No).

---

## 7. Dependencies

| Dependency | Source |
|------------|--------|
| **TinyMCE** (rich-text editor) | **Bundled locally** at `app/libs/tinymce/` (GPL, `license_key: 'gpl'`) |
| jQuery 3.6.0 | `https://code.jquery.com/jquery-3.6.0.min.js` (CDN) |
| Bootstrap 4.5.2 | `https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/` (CDN) |
| Popper.js 1.16.1 | jsDelivr (CDN) — Bootstrap dependency |
| Select2 4.1.0-rc.0 | jsDelivr (CDN) — loaded, likely legacy |
| Zoho Creator Widget SDK 2.0 | `https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js` (CDN) |

**Creator SDK calls used:** `UTIL.getInitParams`, `UTIL.getQueryParams`, `DATA.getRecords` (paginated), `DATA.getRecordById`, `DATA.addRecords`, `DATA.updateRecordById`, `FILE.uploadFile`.

> The `app/libs/tinymce/` folder (editor core, plugins, skins, and 50+ language packs, ~500 KB+) **must be deployed with the widget** — it is referenced via relative paths (`base_url: 'libs/tinymce'`).

---

## 8. Setup / Deployment Notes

1. Upload the widget **including the entire `app/libs/tinymce/` directory** to the `research-application-env` app.
2. Ensure all forms/reports listed in §2 exist, and that every user has a `My_User_Details` record with the correct email and `Profile`.
3. Embed so it opens with `?meetingId=<id>` (or rely on the latest-meeting fallback).
