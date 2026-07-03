# Report Workflows — One Pager Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** One Pager · **Section:** Report Workflows

These six report-level action workflows drive how users retrieve and view one-pager documents from the One Pager reports. Two of them (`Download_one_pager` and `download_one_pager1`) are near-identical WorkDrive integrations that generate a temporary download link for a stored one-pager PDF and open it in a new window. `Open_download_url` does the same for the aggregated report PDF. The remaining three are lightweight navigation actions: opening a one-pager record in the widget/edit page (`Open_Widget3`), opening it in clone mode (`Open_one_pager_with_cloni`), and opening the print/preview page (`Print_PDF`).

## Summary

| # | Link name (file) | Workflow name | Report | Trigger | Status | GitHub |
|---|------------------|---------------|--------|---------|--------|--------|
| 1 | `Download_one_pager` | Download one pager | In My One Pagers | On click of action item: Download | — | [Download_one_pager.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Download_one_pager.js) |
| 2 | `Open_Widget3` | Open Widget | One Page Module Report | On click of action item: Edit One Pager | — | [Open_Widget3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_Widget3.js) |
| 3 | `Open_download_url` | Open download url | One Pager Report Report & One Pager Overall Report | On click of action item | — | [Open_download_url.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_download_url.js) |
| 4 | `Open_one_pager_with_cloni` | Open one pager with cloning params | In My One Pagers | On click of action item: Clone | — | [Open_one_pager_with_cloni.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_one_pager_with_cloni.js) |
| 5 | `Print_PDF` | Print PDF | One Page Module Report | On click of action item: Preview | — | [Print_PDF.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Print_PDF.js) |
| 6 | `download_one_pager1` | download one pager | In All One Pagers | On click of action item: Download | — | [download_one_pager1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/download_one_pager1.js) |

## Workflow Details

### 1. `Download one pager`

- **Link name (file):** `Download_one_pager`
- **Workflow name:** `Download one pager`
- **Report:** In My One Pagers
- **Trigger / Event:** On click of action item: Download
- **GitHub:** [Download_one_pager.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Download_one_pager.js)

**What it does**

- Builds JSON headers (`Accept: application/vnd.api+json`, `Content-Type: application/json`).
- Assembles a WorkDrive link-creation payload from `att_param1`:
  - `resource_id` = `input.File_Resource_Id` (the stored one-pager file).
  - `link_name` = URL-encoded `input.Company_Name.Company_Name + " - " + <current MM-yyyy>`.
  - `link_type` = `"download"`, `request_user_data` = `"false"`, `allow_download` = `"true"`.
- Wraps the attributes under `data.type = "links"` and POSTs to `https://www.zohoapis.in/workdrive/api/v1/links` using the `zoho_workdrive_connection` connection. Note: `parameters` is sent as `data.toString()`.
- Reads `data.attributes.download_url` from the response, appends `?directDownload=true`, and calls `openUrl(download_url, "new window")` to trigger the download.

> **Duplicate note:** This is effectively identical to `download_one_pager1` (#6). The only differences are the source report (**In My One Pagers** here vs. **In All One Pagers** there); the Deluge logic is the same.

---

### 2. `Open Widget`

- **Link name (file):** `Open_Widget3`
- **Workflow name:** `Open Widget`
- **Report:** One Page Module Report
- **Trigger / Event:** On click of action item: Edit One Pager
- **GitHub:** [Open_Widget3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_Widget3.js)

**What it does**

- Single-line navigation action. Calls `openUrl("#Page:One_Pager?recordid=" + input.ID, "new window", "successive=true")` to open the `One_Pager` page (the editing widget) for the selected record in a new window.

---

### 3. `Open download url`

- **Link name (file):** `Open_download_url`
- **Workflow name:** `Open download url`
- **Report:** One Pager Report Report and One Pager Overall Report
- **Trigger / Event:** On click of action item
- **GitHub:** [Open_download_url.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_download_url.js)

**What it does**

- Same WorkDrive link-creation pattern as #1/#6, but for the aggregated report file:
  - `resource_id` = `input.Resource_Id`.
  - `link_name` = `<current MM-yyyy> + " Report"` (not URL-encoded here).
  - `link_type` = `"download"`, `request_user_data` = `"false"`, `allow_download` = `"true"`.
- POSTs to `https://www.zohoapis.in/workdrive/api/v1/links` via `zoho_workdrive_connection`. Note: `parameters` is sent as the `data` map directly (not `.toString()`), differing from #1/#6.
- Reads `data.attributes.download_url`, appends `?directDownload=true`, and opens it with `openUrl(download_url, "new window")`.

---

### 4. `Open one pager with cloning params`

- **Link name (file):** `Open_one_pager_with_cloni`
- **Workflow name:** `Open one pager with cloning params`
- **Report:** In My One Pagers
- **Trigger / Event:** On click of action item: Clone
- **GitHub:** [Open_one_pager_with_cloni.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Open_one_pager_with_cloni.js)

**What it does**

- Builds a URL to the `One_Pager` page in clone mode: `baseUrl = "#Page:One_Pager"`, then `url = baseUrl + "?create_new=true&recordid=" + input.ID`.
- Calls `openUrl(url, "new window", "successive=true")`. The `create_new=true` param signals the page to clone the referenced record into a new one-pager.

---

### 5. `Print PDF`

- **Link name (file):** `Print_PDF`
- **Workflow name:** `Print PDF`
- **Report:** One Page Module Report
- **Trigger / Event:** On click of action item: Preview
- **Status:** first-line trailing info notes `-- to preview one pager`
- **GitHub:** [Print_PDF.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/Print_PDF.js)

**What it does**

- Constructs the print page URL: `"https://creatorapp.zoho.in" + zoho.appuri + "#Page:Print_One_Pager?recordId=" + input.ID`.
- Calls `openURL(url, "new window", "successive=true")` to open the `Print_One_Pager` preview page for the selected record.

---

### 6. `download one pager`

- **Link name (file):** `download_one_pager1`
- **Workflow name:** `download one pager`
- **Report:** In All One Pagers
- **Trigger / Event:** On click of action item: Download
- **GitHub:** [download_one_pager1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Report_Workflows/download_one_pager1.js)

**What it does**

- Identical WorkDrive download-link flow as #1 (`Download_one_pager`):
  - `resource_id` = `input.File_Resource_Id`.
  - `link_name` = URL-encoded `input.Company_Name.Company_Name + " - " + <current MM-yyyy>`.
  - `link_type` = `"download"`, `request_user_data` = `"false"`, `allow_download` = `"true"`.
  - POSTs to the WorkDrive `links` endpoint via `zoho_workdrive_connection` with `parameters:data.toString()`.
  - Reads `download_url`, appends `?directDownload=true`, and opens it via `openUrl(download_url, "new window")`.

> **Duplicate note:** This is a near-exact copy of #1 (`Download_one_pager`); the sole meaningful difference is that this one is wired to the **In All One Pagers** report, whereas #1 is wired to **In My One Pagers**. The workflow name (`download one pager`) also differs only in casing from #1's `Download one pager`.

---
