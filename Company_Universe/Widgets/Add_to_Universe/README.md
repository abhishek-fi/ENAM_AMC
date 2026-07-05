# Universe Addition — Widget Documentation

> **Platform:** Zoho Creator widget
> **Zoho Creator App:** `research-application-env`
> **Entry file:** `app/widget.html` (self-contained; ~1 MB, all HTML + CSS + JS inline) + `app/styles.css`

---

## 1. Purpose

The **Universe Addition** widget drives the firm's **three-level company ideation and coverage-initiation workflow** — the process of evaluating a *new* company before it becomes part of the research "universe" (ENAM coverage).

A company is worked through **Level 1 → Level 2 → Level 3**, and at each level it must be approved by **three Fund Managers (FM 1, FM 2, FM 3)** and then the **Head of Research (HoR)**. Reviewers can approve, reject, or request clarification (which bounces back to the Analyst). Only when a level is fully approved does the next level unlock. Final HoR approval at Level 3 marks the company as covered (`ENAM_Coverage = "Yes"`).

| Level | Focus |
|-------|-------|
| **L1** | Initial screening — company basics, philosophy fit, L1 criteria, shareholding, pre-assessment, broker presentation |
| **L2** | Financial modelling and broker teach-in |
| **L3** | ENAM financial model, company meeting, detailed presentation, and final task assignments |

---

## 2. Where It Runs & What It Touches

| Item | Value |
|------|-------|
| **Zoho Creator app** | `research-application-env` |
| **Opened via URL param** | Record ID — `recid` / `id` / `recordId` / `ID` (**required**; error if missing) |
| **Logged-in user** | Read from `ZOHO.CREATOR.UTIL.getInitParams()` |

### Reports & forms
| Report / Form | Direction | Purpose |
|---------------|-----------|---------|
| `Company_Universe_Report` | read/write | Main company record (all L1/L2/L3 fields + approvals) |
| `All_Sector_Masters` | read | Sector reference list |
| `Sector_Masters` | write | Creates a new sector if the Analyst enters one not in the list |
| `All_User_Masters` | read | User profile lookup by email (Profile, First/Last Name, ID) |

---

## 3. User Roles & Permissions

| Role | What they can do |
|------|------------------|
| **Analyst** | Full read/write on all sections. Fills L1 form, uploads files, and responds to clarification requests via **Re-Submit**. Cannot approve. On L1 submit, `Analyst2` is set to the logged-in user. |
| **Fund Manager (FM)** | Read-only until it's their turn. **Row-level access** — an FM only sees/acts on *their own* FM 1/2/3 row (matched by email → ID). Can Approve / Reject / request Clarification. Once they act, their row locks. |
| **Head of Research (HoR)** | Same pattern as FM, but the HoR review only becomes active **after all three FMs have approved** that level. |
| **Admin** | Unrestricted — same as Analyst. |

> Access control is applied at runtime (`applyRoleBasedAccessControl`, `applyL1FMAccessControl`, etc.).

---

## 4. Workflow / State Machine

Each level has the same gated pattern:

```
Analyst submits level
      │
      ▼
FM 1 / FM 2 / FM 3 review  (each: Pending → Approved | Rejected | Clarification Needed)
      │   └─ Clarification Needed → Analyst edits response → Re-Submit → back to that FM
      ▼  (all three = Approved)
HoR review                 (Approved | Rejected | Clarification Needed)
      │  (Approved)
      ▼
Level complete → "Next Level" unlocks
```

- **Status enum (case-sensitive):** `Pending`, `Approved`, `Rejected`, `Clarification Needed`.
- **Level gating:** L2 sections only appear once L1 is fully approved; L3 once L2 is. `Next Level` validates the current level before advancing.
- **Completion:** L3 HoR approval auto-sets `ENAM_Coverage = "Yes"`.

---

## 5. Key Features & UI

- **Level/section navigation** — top navbar (level title, company name, Previous/Next Level) with per-section tabs that show/hide based on level and approval status.
- **L1 data capture:** company basics (name, IPO name, Theme, promoter rating, sector), ENAM philosophy (Yes/Partial/No — "Partial" requires an explanation), an **8-row L1 Criteria table** (market cap, free float, latest price, 52-wk high/low, 30/60/90-day volumes — each Yes/No + value), and a **6-row shareholding table** (Promoters, FIIs, MFs, Banks, Insurance, Others %).
- **Review tables** (FM & HoR, per level): reviewer name, initiated date, status, status-updated date, clarification (reviewer), clarification response (Analyst), and role-appropriate action buttons.
- **File uploads:** pre-assessment docs, broker presentations, L3 presentation materials.
- **L3 final assignments:** "prepared by" + status for each downstream task (Addition to Universe, One Pager, forecast sheet, forward charts, 9 Pillars, ENAM universe list).
- **Custom modal system** for success/error/warning/info and confirmations.
- **Validation:** mandatory-field checks on submit, real-time L1 criteria highlighting, 2-decimal auto-formatting, and new-sector creation on submit.

---

## 6. Data Model (key API field names)

**Company basics:** `Company_Name`, `IPO_Name`, `Theme`, `Rating_Promoter`, `Sector`, `Sector_Name`, `Industry_Name`, `Description_of_company_business`, `ENAM_Investment_Philoshophy`.

**L1 criteria (Yes/No + amount pairs):** `Marketing_Capitalization_Rs_Cr` / `_Amount`, `Free_flot_market_capitalization_Rs_Cr` / `Free_flot_marketing_capitalization_amount`, `Latest_Price_Default` / `Latest_price_amount`, `week_High_Date` / `_amount`, `week_Low_Date` / `_amount`, `days_average_daily_volumes` / `_amount`, `months_average_daily_volumes` / `_amount`, `months_average_daily_volumes1` / `month_average_daily_volume_amount`.

**Shareholding:** `Shareholding_Promoters_Pattern`, `Shareholding_FII_Pattern`, `Shareholding_MF_Pattern`, `Shareholding_Bank_Pattern`, `Shareholding_Insurance_Pattern`, `Shareholding_Others_Pattern`.

**Approvals (per level):**
| Level | FM status fields | HoR status | Reviewer lookups |
|-------|------------------|------------|------------------|
| L1 | `FM1_Status`, `FM2_Status`, `FM3_Status` | `HoR_Status` | `FM1_Name`, `FM2_Name`, `FM3_Name` |
| L2 | `L2_FM1_Status1`, `L2_FM2_Status`, `L2_FM3_Status` | `L2_HoR_Status` | (L2-prefixed) |
| L3 | `L3_FM1_Status`, `L3_FM2_Status`, `L3_FM3_Status` | `L3_HoR_Status` | (L3-prefixed) |

Plus per-reviewer dates and clarification fields (e.g. `FM1_Approval_Initiated_Date`, `FM1_Clarification_Requested`, `Clarification_Description_FM1`), `Analyst2`, and `ENAM_Coverage`.

---

## 7. Dependencies

| Dependency | Source |
|------------|--------|
| Zoho Creator Widget SDK 2.0 | `https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js` (CDN) |

No jQuery, Bootstrap or other third-party frameworks — all UI is hand-rolled with inline CSS + `styles.css`. `translations/en.json` is empty. `plugin-manifest.json` declares `service: CREATOR` with no CSP domains.

**Creator SDK calls used:** `DATA.getRecords`, `DATA.getRecordById`, `DATA.addRecords`, `DATA.updateRecordById`, `UTIL.getQueryParams`, `UTIL.getInitParams`.

> The widget file is ~1 MB mostly because all app logic is inline; there is no minified vendor bundle beyond the SDK loaded from CDN.

---

## 8. Setup / Deployment Notes

1. Upload the widget to the `research-application-env` app; embed so it opens with a **record ID** query param (`recid`/`id`/`recordId`/`ID`).
2. Ensure the reports/forms exist: `Company_Universe_Report`, `All_Sector_Masters`, `Sector_Masters`, `All_User_Masters`.
3. Every user must have an `All_User_Masters` record with a matching `Email_Id` and a valid `Profile` (`Analyst` / `Fund Manager` / `Head of Research` / `Admin`).
4. Confirm all field names on `Company_Universe_Report` match the widget code **exactly**.

**Init flow:** on load it fetches the user profile (email → `All_User_Masters`), reads the record ID from the URL, fetches the record via `getRecordById`, then cascades through ~15 `populate*` functions to fill every section, and finally applies role-based access control.
