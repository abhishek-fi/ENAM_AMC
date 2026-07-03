# Report Workflows — Company Meeting Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Meeting · **Section:** Report Workflows

This section documents the report-level action-item workflows for the Company Meeting module. Both workflows are identical single-line handlers wired to different reports: each fires from an "Edit" action item on a Company Meeting record and opens the `Company_Meeting1` application page in a new browser window, passing the selected record's ID (`input.ID`) as the `recordId` URL parameter. They effectively act as "Edit" navigation shortcuts — one for the all-records report and one for the personal (My) report.

## Summary

| # | Link name (file) | Workflow name | Report | Trigger | Status | GitHub |
|---|------------------|---------------|--------|---------|--------|--------|
| 1 | `Open_Widget4` | Open Widget | In All Company Meetings | On click of action item: Edit Company Meeting | — | [Open_Widget4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Report_Workflows/Open_Widget4.js) |
| 2 | `Open_Widget5` | Open Widget | In My Company Meetings | On click of action item: Edit | — | [Open_Widget5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Report_Workflows/Open_Widget5.js) |

## Workflow Details

### 1. `Open Widget`

- **Link name (file):** `Open_Widget4`
- **Workflow name:** `Open Widget`
- **Report:** In All Company Meetings
- **Trigger / Event:** On click of action item: Edit Company Meeting
- **Status:** —
- **GitHub:** [Open_Widget4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Report_Workflows/Open_Widget4.js)

**What it does**

- On clicking the "Edit Company Meeting" action item in the **In All Company Meetings** report, the workflow calls `openUrl(...)` targeting `"new window"`.
- The URL is built as `"https://creatorapp.zoho.in" + zoho.appuri + "#Page:Company_Meeting1?recordId=" + input.ID`, i.e. it opens the `Company_Meeting1` application page for the selected record, passing the record's ID via the `recordId` query parameter.
- No conditions, custom functions, or data operations are involved — it is a pure navigation shortcut for editing the selected meeting.

---

### 2. `Open Widget`

- **Link name (file):** `Open_Widget5`
- **Workflow name:** `Open Widget`
- **Report:** In My Company Meetings
- **Trigger / Event:** On click of action item: Edit
- **Status:** —
- **GitHub:** [Open_Widget5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Report_Workflows/Open_Widget5.js)

**What it does**

- On clicking the "Edit" action item in the **In My Company Meetings** report, the workflow calls `openUrl(...)` targeting `"new window"`.
- The URL is built identically to Workflow 1: `"https://creatorapp.zoho.in" + zoho.appuri + "#Page:Company_Meeting1?recordId=" + input.ID`, opening the `Company_Meeting1` page for the selected record with `recordId` set to the record ID.
- No conditions, custom functions, or data operations are involved — it is a pure navigation shortcut, differing from Workflow 1 only in which report it is attached to.
