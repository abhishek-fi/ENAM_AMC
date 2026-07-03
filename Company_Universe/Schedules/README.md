# Schedules — Company Universe Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Section:** Scheduled Workflows

This folder holds the scheduled workflows for the Company Universe module. They cover three areas: importing daily market data into the module from a WorkDrive CSV (`Company Universe CSV Data Scheduler`), refreshing the Company Master and Price Master data by delegating to app-level functions (`Update Company Master`, `Update Price Master`), and cleaning up file-upload fields by dropping files the user marked for removal (`Remove detailed presentation file`, `Remove_file`). The two Master-update schedules and the CSV importer run daily; the Company/Price Master ones additionally skip weekends (they only run Tuesday–Saturday, i.e. when `getDayOfWeek()` is not 1/Sunday or 7/Saturday). The two file-cleanup schedules are field/time-triggered ("Based on Remove Time") rather than fixed-clock schedules. None of these five schedules use the `zoho.appuri.contains("environment")` production guard, and none carry a comment marking them as disabled — all are treated as Active.

## Summary

| # | Link name (file) | Schedule name | Frequency / Time | Status | Calls | GitHub |
|---|------------------|---------------|------------------|--------|-------|--------|
| 1 | `Company_Universe_CSV_Data` | Company Universe CSV Data Scheduler | Daily at 08:00:00 (started 24-Dec-2025) | Active | inline (invokeurl to WorkDrive) | [Company_Universe_CSV_Data.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Company_Universe_CSV_Data.js) |
| 2 | `Remove_detailed_presentat` | Remove detailed presentation file | Field/time-triggered ("Based on Remove Time Detail") | Active | inline | [Remove_detailed_presentat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Remove_detailed_presentat.js) |
| 3 | `Remove_file` | Remove_file | Field/time-triggered ("Based on Remove Time") | Active | inline | [Remove_file.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Remove_file.js) |
| 4 | `Update_Company_Master` | Update Company Master | Daily at 09:20:00, skips Sun/Sat (started 07-Feb-2026) | Active | `thisapp.processCompanyMaster()` | [Update_Company_Master.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Update_Company_Master.js) |
| 5 | `Update_Price_Master` | Update Price Master | Daily at 09:30:00, skips Sun/Sat (started 07-Feb-2026) | Active | `thisapp.processPriceMaster()` | [Update_Price_Master.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Update_Price_Master.js) |

## Schedule Details

### 1. `Company Universe CSV Data Scheduler`

- **Link name (file):** `Company_Universe_CSV_Data`
- **Schedule name:** `Company Universe CSV Data Scheduler`
- **Frequency / Time:** Daily at 08:00:00 (first run 24-Dec-2025)
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Company_Universe_CSV_Data.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Company_Universe_CSV_Data.js)

**What it does**

Downloads a CSV file from Zoho WorkDrive and syncs its price data into the `Company_Universe` form.

1. Downloads a fixed WorkDrive file (hard-coded `fileId = "mp02116163d97bf8b46bba90b38c2a8e6a48a"`) via `invokeurl` GET to `https://download.zoho.in/v1/workdrive/download/<fileId>` using the `zoho_workdrive_connection`.
2. Converts the response to text and splits it into rows on newline (`toList("\n")`), then drops the first two rows (`subList(2, newrowsize)`) — i.e. header/preamble lines — keeping only data rows.
3. For each data row, splits on comma into `new_column` and reads the ISIN from column index 6 (`isin_no`). Rows with an empty ISIN are skipped.
4. For rows with an ISIN, it reads: company name (col 1), 52-week high price (col 10), 52-week low price (col 11), and closing price (`NDP_Close`, col 7). It then looks up existing records via `Company_Universe[CD_ISIN_No == isin_no]`.
   - **If a matching record exists** (`isinrecords.count(ID) > 0`): loops the matching records and updates `week_High_Date_amount`, `week_Low_Date_amount`, and `Closing_Price`.
   - **If no match exists:** inserts a new `Company_Universe` record with `Company_Name`, `Closing_Price`, `week_High_Date_amount`, `week_Low_Date_amount`, `CD_ISIN_No`, and `Added_User = zoho.loginuser`.
5. Several lines are commented out and inactive: most `info` debug statements, and the `companyid`/`companyPrice` lookup lines (a `Price_Master[Company_Name == company_name]` query that is not used).

---

### 2. `Remove detailed presentation file`

- **Link name (file):** `Remove_detailed_presentat`
- **Schedule name:** `Remove detailed presentation file`
- **Frequency / Time:** Field/time-triggered — first line reads "Based on Remove Time Detail" (runs off a date/time field rather than a fixed clock schedule)
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Remove_detailed_presentat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Remove_detailed_presentat.js)

**What it does**

Cleans up the `Detailed_Presentation_File` multi-file field by removing the files the user flagged for deletion.

1. Fetches all `Company_Universe` records where `Removed_list_detail != ""` (records that have files marked for removal).
2. For each such record, reads the `Removed_list_detail` value into `removeList` and builds a new empty `finalList`.
3. Iterates every file `e` in `Detailed_Presentation_File`; if `e` is NOT contained in `removeList`, it is added to `finalList`. This effectively keeps only files not marked for removal.
4. Assigns `finalList` back to `rec.Detailed_Presentation_File`, replacing the field with the filtered set.
5. Contains several active `info` debug statements (`info removeList`, `info "///"`, `info e`, etc.) but no commented-out logic.

---

### 3. `Remove_file`

- **Link name (file):** `Remove_file`
- **Schedule name:** `Remove_file`
- **Frequency / Time:** Field/time-triggered — first line reads "Based on Remove Time" (runs off a date/time field rather than a fixed clock schedule)
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Remove_file.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Remove_file.js)

**What it does**

Same cleanup pattern as schedule #2, but applied to the `Pre_Assessment_Presentation1` file field. The first-line comment has no distinct human name segment beyond the link name, so the schedule name is taken as `Remove_file` (derived from the link name / trailing segment).

1. Fetches all `Company_Universe` records where `Removed_List != ""`.
2. For each record, reads `Removed_List` into `removeList` and builds a new empty `finalList`.
3. Iterates every file `e` in `Pre_Assessment_Presentation1`; if `e` is NOT contained in `removeList`, it is added to `finalList` (keeping only files not marked for removal).
4. Assigns `finalList` back to `rec.Pre_Assessment_Presentation1`.
5. Contains active `info` debug statements; no commented-out logic.

---

### 4. `Update Company Master`

- **Link name (file):** `Update_Company_Master`
- **Schedule name:** `Update Company Master`
- **Frequency / Time:** Daily at 09:20:00 (first run 07-Feb-2026); skips weekends
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Update_Company_Master.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Update_Company_Master.js)

**What it does**

A thin wrapper that runs the Company Master refresh only on weekdays.

1. Reads today's day-of-week via `zoho.currentdate.getDayOfWeek()`.
2. If today is not `1` (Sunday) and not `7` (Saturday), it calls the app-level function `thisapp.processCompanyMaster()`. All the actual update logic lives in that function; the schedule itself only gates it against weekends.

---

### 5. `Update Price Master`

- **Link name (file):** `Update_Price_Master`
- **Schedule name:** `Update Price Master`
- **Frequency / Time:** Daily at 09:30:00 (first run 07-Feb-2026); skips weekends
- **Status:** Active
- **Production guard:** No
- **GitHub:** [Update_Price_Master.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Schedules/Update_Price_Master.js)

**What it does**

Mirror of schedule #4 for the Price Master.

1. Reads today's day-of-week via `zoho.currentdate.getDayOfWeek()`.
2. If today is not `1` (Sunday) and not `7` (Saturday), it calls the app-level function `thisapp.processPriceMaster()`. The update logic lives in that function; the schedule only gates it against weekends. It runs 10 minutes after Update Company Master.

---
