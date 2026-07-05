# Focus List Addition — Widget Documentation

> **Platform:** Zoho Creator widget
> **Zoho Creator App:** `research-application-env`
> **Entry file:** `app/widget.html` (self-contained HTML + CSS + JavaScript)

---

## 1. Purpose

The **Focus List Addition** widget manages a **multi-stage approval workflow** for adding an investment-research company to the firm's **Focus List**.

An Analyst proposes a company with its valuation and liquidity metrics. The proposal must then be approved *in sequence* by the **CIO → Fund Manager 1 → Fund Manager 2 → Head of Research (HoR)**. Any approver can:

- **Approve** — move the proposal to the next approver.
- **Ask for Clarification** — send it back to the Analyst, who must respond before it continues.
- **Reject (Final)** — permanently end the workflow.

Once all four approvers sign off, the company is **automatically added to the Focus List** and tagged as part of the folio. The widget provides a full audit trail of every decision.

---

## 2. Where It Runs & What It Touches

| Item | Value |
|------|-------|
| **Zoho Creator app** | `research-application-env` |
| **Opened via URL param** | `?companyId=<RECORD_ID>` (**required**) |
| **Logged-in user** | Read from `ZOHO.CREATOR.UTIL.getInitParams()` |

### Reports read
| Report | Used by | Purpose |
|--------|---------|---------|
| `My_Companies` | Analysts | Shows only companies assigned to the logged-in Analyst |
| `Company_Universe_Report` | CIO, FMs, HoR | Full company universe |
| `All_User_Masters` | All | Looks up user profile (by email), CIO, HoR, and Fund Managers |

> **Report switching:** `getReportName()` returns `My_Companies` for the Analyst profile and `Company_Universe_Report` for everyone else. This is intentional so Analysts only see their own records.

### Subforms (audit trail — one per approval stage)
| Subform | Records actions by | Comment field |
|---------|-------------------|---------------|
| `Focus_List_CIO_Stage` | CIO | `CIO_Comment` |
| `Focus_List_FM_1_Stage` | FM 1 | `FM_1_Comment` |
| `Focus_List_FM_2_Stage` | FM 2 | `FM_2_Comment` |
| `Focus_List_HoR_Stage` | HoR | `HoR_Comment` |

Each subform row also stores `Name` (user ID), `Status`, `Analyst_Clarification`, `Submitted_By` (role), and `Submitted_Time`. Rows are **only appended, never deleted** — they form an immutable history.

---

## 3. User Roles & Permissions

| Role | Profile name(s) | What they can do |
|------|-----------------|------------------|
| **Analyst** | `Analyst`, `Analyst Admin` | Edit company data, choose FM 1 & FM 2, submit for approval, respond to clarification requests. Can only touch companies where `Analyst2` = their own user ID. |
| **CIO** | `CIO` | Approve / clarify / reject at the first stage. |
| **Fund Manager** | `Fund Manager` | Reviews at the FM 1 or FM 2 stage — but only if they are the assigned FM for that company. |
| **Head of Research** | `Head of Research` | Final approval. On approval the company is auto-added to the Focus List. |

Approvers can **never edit** the company fields; they only act on the proposal. Access control is decided at runtime in `updateFieldPermissions()` based on profile + current stage.

---

## 4. Workflow / State Machine

The current state lives in the record field **`Focus_List_Stage`**. Progression:

```
(empty) ──submit──► Submitted for Review
                          │
        ┌─────────────────┼──────────────────────────┐
        ▼                 ▼                           ▼
   CIO Approved   CIO Clarification Request     Rejected by CIO (END)
        │           │  ▲ (Analyst replies →
        │           │   "Clarification to CIO")
        ▼           └──┘
   FM 1 Approved  (same clarify / reject pattern)
        ▼
   FM 2 Approved  (same clarify / reject pattern)
        ▼
   HoR stage      (same clarify / reject pattern)
        ▼
   Added to Focus List (END — success)
```

**On each approval** the matching flag is set: `Approved_by_CIO`, `Approved_by_FM_1`, `Approved_by_FM_2`, `Approved_by_HoR`.

**On final HoR approval** the widget automatically sets:
`Focus_List_Stage = "Added to Focus List"`, `Focus_List_In_Progress = false`, `Added_to_Focus_List = true`, `Part_of_Folio = "Yes"`, `Part_of_Focus_List = "Yes"`, and stamps `Date_Added_to_Focus_List`.

**Rejection** at any stage sets a terminal stage (`Rejected by CIO / FM 1 / FM 2 / HoR`) and `Focus_List_In_Progress = false`.

**Clarification loop:** an approver can bounce the proposal back to the Analyst any number of times. The Analyst must reply with a mandatory comment before it returns to the approver.

---

## 5. Key Features & UI

**Left panel — Company Details** (editable by Analyst only, before submission):
Company, Sector (read-only), Closing Price, Target Price, Return % (auto-calculated), Stock Upside, Upside/Downside, Recommendation, Liquidity, Liquidity Remarks, Market Capitalization, Valuation Remarks, Other (Yes/No → reveals *Other Details*).

**Right panel — dynamic action area**, changes by role & stage:
- Analyst submission: FM 1 & FM 2 dropdowns + **Submit for Approval**
- Approver review: comment box + **Approve / Ask for Clarification / Reject (Final)**
- Analyst clarification: mandatory comment + **Submit Clarification**
- Completion: read-only summary of assigned FMs and date added

**Other UI:** approval-chain badges (Analyst → CIO → FM 1 → FM 2 → HoR) with colour states, a stage banner, a "Latest Update" panel, and a full **Comments & Decisions** timeline table.

### Validation rules
- All fields marked with a red `*` are mandatory before submit.
- **Closing Price = 0** locks Target Price, Stock Upside and Upside/Downside (analysis can't proceed without a price baseline).
- **Return % = (Target − Closing) / Closing × 100**, recomputed live.
- FM 1 and FM 2 must be **different** people.
- Price fields: max 10 digits, 2 decimals (Market Cap allows 4).
- Comment is **optional for approval**, **mandatory for clarification and rejection**.

---

## 6. Data Model (key API field names)

| Field | API name | Notes |
|-------|----------|-------|
| Company Name | `Company_Name` | |
| Sector | `Sector` | Lookup |
| Closing Price | `Closing_Price` | May be nested lookup |
| Target Price | `Target_price` | |
| Stock Upside | `Stock_Upside` | |
| Upside/Downside | `Upside_Downside` | `Upside` / `Downside` |
| Recommendation | `Recommendation` | |
| Liquidity | `Liquidity` | `High` / `Medium` / `Low` |
| Liquidity Remarks | `Liquidity_Remarks` | |
| Market Capitalization | `Market_Capitalization` | |
| Valuation Remarks | `Valuation_remarks` | |
| Other / Other Details | `Other` / `Other_Details` | |
| Assigned Analyst | `Analyst2` | Lookup → user |
| Fund Managers | `FM_1_Name`, `FM_2_Name` | Lookup → user |
| Stage | `Focus_List_Stage` | See workflow above |
| In progress flag | `Focus_List_In_Progress` | |
| Approval flags | `Approved_by_CIO/_FM_1/_FM_2/_HoR` | Boolean |
| Completion | `Added_to_Focus_List`, `Part_of_Folio`, `Part_of_Focus_List`, `Date_Added_to_Focus_List` | |

---

## 7. Dependencies

| Dependency | Source |
|------------|--------|
| jQuery 3.6.0 | `https://code.jquery.com/jquery-3.6.0.min.js` (CDN) |
| Zoho Creator Widget SDK 2.0 | `https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js` (CDN) |

**Creator SDK calls used:** `UTIL.getQueryParams`, `UTIL.getInitParams`, `DATA.getRecords`, `DATA.getRecordById`, `DATA.updateRecordById`.

`translations/en.json` is present but empty. `plugin-manifest.json` declares `service: CREATOR` with no CSP domains or config.

---

## 8. Setup / Deployment Notes

1. Upload the widget to the `research-application-env` app.
2. Embed it so it is opened with **`?companyId=<record id>`** in the URL — without it the widget shows a warning and does nothing.
3. Ensure the reports `My_Companies`, `Company_Universe_Report` and `All_User_Masters` exist, and that every user has a record in `All_User_Masters` with a correct `Email_Id` and `Profile`.
4. Ensure the four stage subforms exist on the company form with the field names listed above.

**Init sequence:** read `companyId` → fetch user profile by email → fetch CIO & HoR → load company record → load Fund Managers → render UI, permissions, banner, latest comment and timeline.
