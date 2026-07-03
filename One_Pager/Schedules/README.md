# Schedules — One Pager Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** One Pager · **Section:** Scheduled Workflows

These seven schedules drive the monthly One Pager production pipeline for the previous month's submitted one-pagers. The chain runs asynchronously: **FI_AB Get Chart and Upload** pulls PE-band data from Zoho Sheet per ticker and generates/uploads charts; **FI_AB Initiate the HTML process** builds the per-record price table and static HTML; **PDF_Combing_Process_Start** creates/ensures the monthly `One_Pager_Report` record and dispatches submitted records to Zoho Writer combine jobs in batches of 20 (parts); **Combine_PDF_Parts_FI_AB** waits for all part jobs to complete, downloads them and merges into a single monthly PDF via Zoho Writer; **Get_Final_PDF_FI_AB** polls the combined job status and stores the final document resource id. Two housekeeping schedules round it out: **One Pager Reminder** emails analysts who have not yet added a one-pager this month, and **FI_AB One pager flag** resets the `Current_Month_One_Pager` flag on the Company Universe at month start. All pipeline schedules compute the previous-month date window (many are noted in comments as still running Daily but intended to be Monthly). None of these files contain the `appUri.contains("environment")` production guard.

## Summary

| # | Link name (file) | Schedule name | Frequency / Time | Status | Calls | GitHub |
|---|------------------|---------------|------------------|--------|-------|--------|
| 1 | `Combine_PDF_Parts_FI_AB` | Combine_PDF_Parts_FI_AB | Daily at 20:12 (comment: should be monthly) | Active | Zoho Writer combine API, `zoho_oauth_connection` | [Combine_PDF_Parts_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/Combine_PDF_Parts_FI_AB.js) |
| 2 | `FI_AB_Get_Chart_and_Uploa` | FI_AB Get Chart and Upload | Daily at 20:34 (comment: should be monthly) | Active | `thisapp.getAccessToken_FI_AB()`, Zoho Sheet API, `thisapp.generateChart()` | [FI_AB_Get_Chart_and_Uploa.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_Get_Chart_and_Uploa.js) |
| 3 | `FI_AB_Initiate_the_HTML_p` | FI_AB Initiate the HTML process | Daily at 20:36 (comment: should be monthly) | Active | `thisapp.GetExcelFileCovertToSheetAndRead()`, `thisapp.FI_AB_One_Pager_Static_HTML()` | [FI_AB_Initiate_the_HTML_p.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_Initiate_the_HTML_p.js) |
| 4 | `FI_AB_One_pager_flag` | FI_AB One pager flag | Monthly at 00:00 (1st of month) | Active | — (direct record update) | [FI_AB_One_pager_flag.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_One_pager_flag.js) |
| 5 | `Get_Final_PDF_FI_AB` | Get_Final_PDF_FI_AB | Daily at 20:15 (comment: should be monthly) | Active | `zoho_oauth_connection` (job status GET) | [Get_Final_PDF_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/Get_Final_PDF_FI_AB.js) |
| 6 | `One_Pager_Reminder` | One Pager Reminder | Monthly at 09:30 | Active | `sendmail` | [One_Pager_Reminder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/One_Pager_Reminder.js) |
| 7 | `PDF_Combing_Process_Start` | PDF_Combing_Process_Start | Daily at 20:10 (comment: should be monthly) | Active | `thisapp.Initiate_PDF_Combining()` | [PDF_Combing_Process_Start.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/PDF_Combing_Process_Start.js) |

## Schedule Details

### 1. `Combine_PDF_Parts_FI_AB`

- **Link name (file):** `Combine_PDF_Parts_FI_AB`
- **Schedule name:** `Combine_PDF_Parts_FI_AB`
- **Frequency / Time:** Daily at 20:12:00 (line 1). A comment on line 2 notes "should be monthly".
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Combine_PDF_Parts_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/Combine_PDF_Parts_FI_AB.js)

**What it does**

This is the final merge step of the PDF pipeline. It:

1. Computes the previous month's `Month_Year_Code` (format `MMM-yyyy`) from `zoho.currenttime`.
2. Fetches the `One_Pager_Report` record for that month; aborts (with an `info` error message) if the record is missing or if its `Folder_Id` is empty.
3. Collects `Part_1_Status_Link` … `Part_5_Status_Link` from the record, filtering out empty ones. Aborts if none are set.
4. For each part status URL, does a GET (via `zoho_oauth_connection`) and verifies the job `status` is `"completed"`; aborts if any part is not yet completed.
5. Re-fetches each job to get its `download_link`, downloads each part PDF, and builds a multipart `paramList` (param names `files`, `files1`, `files2`, …) plus per-file `input_options` with `page_ranges` `1-20`.
6. Sets output settings (name `<Month_Year_Code> Combined.pdf`, target `folder_id`, `overwrite_existing_file` false) and POSTs to the Zoho Writer combine-and-store API (`https://www.zohoapis.in/writer/api/v1/documents/pdf/combine/store`).
7. Parses the response and, if it contains `status_url`, saves it to `Combined_Status_Link` on the `One_Pager_Report` record (picked up later by Get_Final_PDF_FI_AB).

---

### 2. `FI_AB Get Chart and Upload`

- **Link name (file):** `FI_AB_Get_Chart_and_Uploa`
- **Schedule name:** `FI_AB Get Chart and Upload`
- **Frequency / Time:** Daily at 20:34:00 (line 1). Comment on line 2: "as of now it's running daily it should be configured to run monthly".
- **Status:** Active
- **Production guard:** No
- **GitHub:** [FI_AB_Get_Chart_and_Uploa.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_Get_Chart_and_Uploa.js)

**What it does**

Generates and uploads PE-band charts for each submitted one-pager of the previous month:

1. Computes the previous-month date window and fetches `One_Page_Module` records where `Submitted_Date` falls in that window and `Status == "Submitted"`.
2. Gets an access token via `thisapp.getAccessToken_FI_AB()`.
3. For each record, calls the Zoho Sheet API (`worksheet.content.get` on resource `ln7pj9f96d9e6b0224aa3a89bfb84dbe7265c`, worksheet named after the record's `Bloomberg_Ticker`, rows 1–516, columns 1–15) via `zoho_oauth_connection`.
4. Parses the returned `range_details`: extracts header statistics — `mean` (row 1, col 6), `plus1` (row 2, col 8), `minus1` (row 3, col 8), `title` (row 4, col 5) — and builds a data list of `{Date, PE}` pairs from rows > 4 (col 2 = date, col 5 = PE).
5. Assembles an input map (`data`, `mean`, `plus1`, `minus1`, `id`, `title`, `token`) and calls `thisapp.generateChart(iString)` to render and upload the chart.
6. A `sendmail` block for reporting chart-generation responses and the commented hardcoded token line are inactive (commented out).

---

### 3. `FI_AB Initiate the HTML process`

- **Link name (file):** `FI_AB_Initiate_the_HTML_p`
- **Schedule name:** `FI_AB Initiate the HTML process`
- **Frequency / Time:** Daily at 20:36:00 (line 1). Comment on line 2: "should be configured monthly".
- **Status:** Active
- **Production guard:** No
- **GitHub:** [FI_AB_Initiate_the_HTML_p.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_Initiate_the_HTML_p.js)

**What it does**

Builds the price table and static HTML for each submitted one-pager of the previous month:

1. Computes the previous-month date window and fetches `One_Page_Module` records where `Submitted_Date` is in that window and `Status == "Submitted"`.
2. For each record it calls, wrapped in try/catch:
   - `thisapp.GetExcelFileCovertToSheetAndRead(recId)` — builds the price table; on failure emails `abhishek@fristinetech.com`, `parth@fristinetech.com` (subject "Generating price table for one pager failed").
   - `thisapp.FI_AB_One_Pager_Static_HTML(recId)` — generates the one-pager HTML; on failure emails the same recipients (subject "Generate one pager failed").
3. A testing query (`One_Page_Module[ID != 0 && Bloomberg_Ticker != ""]`) and single-record test lines are commented out (inactive), with a prominent comment reminder to keep the real query enabled.

---

### 4. `FI_AB One pager flag`

- **Link name (file):** `FI_AB_One_pager_flag`
- **Schedule name:** `FI_AB One pager flag`
- **Frequency / Time:** Monthly at 00:00:00 (fixed example date 01-Jun-2026, i.e. start of month).
- **Status:** Active
- **Production guard:** No
- **GitHub:** [FI_AB_One_pager_flag.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/FI_AB_One_pager_flag.js)

**What it does**

Month-start housekeeping: fetches all `Company_Universe` records where `Current_Month_One_Pager == true` and sets that flag back to `false` on each, resetting the one-pager selection for the new month. No external calls.

---

### 5. `Get_Final_PDF_FI_AB`

- **Link name (file):** `Get_Final_PDF_FI_AB`
- **Schedule name:** `Get_Final_PDF_FI_AB`
- **Frequency / Time:** Daily at 20:15:00 (line 1). Comment on line 2: "should be monthly and start of the month… accordingly it should be configured later".
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Get_Final_PDF_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/Get_Final_PDF_FI_AB.js)

**What it does**

Finalizes the combined PDF once the Zoho Writer merge job (from schedule 1) completes:

1. Fetches `One_Pager_Report` records where `Combined_Status_Link != ""` and `Resource_Id == ""` (i.e., combine dispatched but final id not yet captured).
2. For each, GETs the `Combined_Status_Link` job status (via `zoho_oauth_connection`), reads `document_id` from the response, and stores it into `Resource_Id` on the record.

---

### 6. `One Pager Reminder`

- **Link name (file):** `One_Pager_Reminder`
- **Schedule name:** `One Pager Reminder`
- **Frequency / Time:** Monthly at 09:30:00.
- **Status:** Active
- **Production guard:** No
- **GitHub:** [One_Pager_Reminder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/One_Pager_Reminder.js)

**What it does**

Reminds analysts who have not submitted a one-pager for the current month:

1. Determines the current month window (`toStartOfMonth()` to `eomonth(0)`).
2. Fetches `User_Master` records where `Profile == "Analyst"` and `User_Status == "Active"`.
3. For each analyst, counts `One_Page_Module` records where `Analyst == analyst.ID` and `Added_Time` is within the month; those with a count of 0 are collected.
4. Sends each such analyst a reminder email (from `rms@enamamc.com`) to add their one-pager, provided their `Email_Id` is set.

---

### 7. `PDF_Combing_Process_Start`

- **Link name (file):** `PDF_Combing_Process_Start`
- **Schedule name:** `PDF_Combing_Process_Start`
- **Frequency / Time:** Daily at 20:10:00 (line 1). Comment on line 2: "should be monthly".
- **Status:** Active
- **Production guard:** No
- **GitHub:** [PDF_Combing_Process_Start.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Schedules/PDF_Combing_Process_Start.js)

**What it does**

Kicks off the PDF combine pipeline for the previous month by dispatching part-batch jobs:

1. Computes the previous-month date window and `Month_Year_Code` (`MMM-yyyy`).
2. Ensures a `One_Pager_Report` record exists for that month — inserts one (with `Added_User` and `Month_Year_Code`) if none is found.
3. Fetches submitted `One_Page_Module` records (`Added_Time` in window, `Status == "Submitted"`) and collects their IDs. Exits if there are none.
4. Splits the record IDs into batches of 20 and, for each batch, calls `thisapp.Initiate_PDF_Combining(currentBatch, batchNumber, monthYearCode)` — which produces the per-part Zoho Writer jobs whose status links are later read by Combine_PDF_Parts_FI_AB.

---
