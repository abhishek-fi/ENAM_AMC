# Functions — Company Universe Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Section:** Standalone Functions

These functions perform bulk ingestion of a master CSV file (downloaded from Zoho WorkDrive) into the Company Universe module, processing the rows in fixed-size chunks of 1000 to stay within Deluge execution limits. `processCompanyMaster` and `processPriceMaster` are the two entry points: they download the same CSV, slice it into chunks, and delegate each chunk to the shared `processChunk` helper in either `"company"` mode (upserting company records into the `Company_Universe` form) or `"price"` mode (upserting price rows into the `Price_Master` form, linked back to the matching Company Universe record). `processCSVInChunks` is a self-recursing alternative entry point that inlines the company upsert logic and calls itself with the next start index until all rows are processed. In every case rows are matched by ISIN (`CD_ISIN_No`): an existing record is updated, otherwise a new one is inserted. Both master entry points end by sending a completion email to the operations team.

## Summary

| # | Link name (file) | Function name | Signature | Purpose |
|---|------------------|---------------|-----------|---------|
| 1 | processCompanyMaster | processCompanyMaster | `void processCompanyMaster()` | Downloads the master CSV and upserts company records into Company Universe in 4 chunks, then emails a completion notice. |
| 2 | processPriceMaster | processPriceMaster | `void processPriceMaster()` | Downloads the master CSV and upserts price rows into Price Master in 4 chunks, then emails a completion notice. |
| 3 | processChunk | processChunk | `void processChunk(list chunkRows, int startIndex, int endIndex, string mode)` | Shared worker that upserts one chunk of CSV rows, into Company Universe (`"company"`) or Price Master (`"price"`), matched by ISIN. |
| 4 | processCSVInChunks | processCSVInChunks | `void processCSVInChunks(int startIndex)` | Self-recursing alternative that ingests the CSV into Company Universe 1000 rows at a time by re-invoking itself. |

## Function Details

### 1. `processCompanyMaster`

- **Link name (file):** `processCompanyMaster`
- **Function name:** `processCompanyMaster`
- **Signature:** `void processCompanyMaster()`
- **GitHub:** [processCompanyMaster.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Functions/processCompanyMaster.js)

**What it does**

- Takes no arguments. It is the entry point for refreshing the **Company Universe** records from the master CSV.
- Downloads a fixed file (`fileId = "0vc13b6995068458b43dbb10c05a9aaf0cc67"`) from Zoho WorkDrive via `invokeurl` against `https://download.zoho.in/v1/workdrive/download/<fileId>` using the `zoho_workdrive_connection` connection.
- Converts the response to a string and splits it on newlines into `csvRows`, then drops the header row with `subList(1, size)` to get `dataRows`. `totalRows` is the number of data rows.
- Loops over the fixed iterators `{"0","1","2","3"}` (i.e. up to 4 chunks of `chunkSize = 1000` → a maximum of 4000 rows). For each iteration it computes `startIndex = iter * 1000` and `endIndex = startIndex + 1000` (capped at `totalRows`), skips iterations whose `startIndex` is past the end, slices out `chunkRows`, and calls `thisapp.processChunk(chunkRows, startIndex, endIndex, "company")`.
- After the loop it logs `"Company Master Processing Completed. Total Rows: " + totalRows`.
- Builds an HTML completion email. The recipient depends on environment: if `zoho.appuri.contains("environment")` the mail goes to `parth@fristinetech.com`, otherwise to `arvind.prajapati@enamamc.com`. It then sends the mail from `parth@fristinetech.com` with a dated subject (`"Company Master Successfully Processed on <dd-MM-yyyy>"`).
- Returns nothing (`void`). The loop runs 4 iterations of 1000 rows (processing up to 4000 data rows).

---

### 2. `processPriceMaster`

- **Link name (file):** `processPriceMaster`
- **Function name:** `processPriceMaster`
- **Signature:** `void processPriceMaster()`
- **GitHub:** [processPriceMaster.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Functions/processPriceMaster.js)

**What it does**

- Takes no arguments. It is the entry point for refreshing the **Price Master** records from the master CSV. It is structurally identical to `processCompanyMaster`, differing only in the mode passed to the worker and in its email text.
- Downloads the same fixed WorkDrive file (`fileId = "0vc13b6995068458b43dbb10c05a9aaf0cc67"`), converts it to a list of lines, and drops the header row to get `dataRows` / `totalRows`.
- Loops over `{"0","1","2","3"}`, slicing the data into up to four 1000-row chunks with the same start/end/cap logic, and calls `thisapp.processChunk(chunkRows, startIndex, endIndex, "price")` for each chunk.
- Logs `"Price Master Processing Completed. Total Rows: " + totalRows`.
- Builds an HTML completion email about the **Price Master** update, chooses the recipient the same way (`parth@fristinetech.com` when the app URI contains `"environment"`, otherwise `arvind.prajapati@enamamc.com`), and sends it from `parth@fristinetech.com` with subject `"Price Master Successfully Processed on <dd-MM-yyyy>"`.
- Returns nothing (`void`). As with the company entry point, the loop runs 4 iterations of 1000 rows (processing up to 4000 data rows).

---

### 3. `processChunk`

- **Link name (file):** `processChunk`
- **Function name:** `processChunk`
- **Signature:** `void processChunk(list chunkRows, int startIndex, int endIndex, string mode)`
- **GitHub:** [processChunk.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Functions/processChunk.js)

**What it does**

- The shared worker called by both `processCompanyMaster` and `processPriceMaster`. It receives one chunk of raw CSV lines (`chunkRows`), the chunk's `startIndex`/`endIndex` (used only for logging), and a `mode` that selects the target form.
- Iterates over each `row` in `chunkRows`, skipping rows that are null/empty. It splits the row on commas into `values` and skips any row with 6 or fewer columns. It reads the ISIN from `values.get(6)` (`Sheet_ISIN_No`) and skips rows where that is null/empty.
- **`mode == "company"`:** Looks up `Company_Universe[CD_ISIN_No == Sheet_ISIN_No]`. If a record exists (`cuRec.CD_ISIN_No != null`), it updates `CD_Bloomberg_Code` (`values.get(4)`), `Company_Name` (`values.get(1)`), `week_High_Date_amount` (`values.get(10)`), `week_Low_Date_amount` (`values.get(11)`), and `Closing_Price` (`values.get(7)`), each guarded by `!isEmpty(...)` so blank cells become null. It also logs a "Name mismatch" info message when the existing name differs from the incoming name. If no record matches, it inserts a new `Company_Universe` record with the same fields plus `Added_User = zoho.adminuser`.
- **`mode == "price"`:** Looks up the matching `Company_Universe` record (`cuRec`) and `Price_Master` record (`pmRec`) by ISIN, and logs `values.get(10)`. If the existing price record's `Company_Name` already equals `cuRec.ID` it updates `Week_High` (`values.get(10)`), `Week_Low` (`values.get(11)`), and `Closing_Price` (`values.get(7)`). Otherwise it inserts a new `Price_Master` record linking `Company_Name = cuRec.ID`, storing `CD_ISIN_No`, `Week_High`, `Week_Low`, `Closing_Price`, and `Added_User = zoho.adminuser`.
- After processing the chunk it logs `"Processed " + mode + " rows from " + startIndex + " to " + endIndex`. Returns nothing (`void`).

---

### 4. `processCSVInChunks`

- **Link name (file):** `processCSVInChunks`
- **Function name:** `processCSVInChunks`
- **Signature:** `void processCSVInChunks(int startIndex)`
- **GitHub:** [processCSVInChunks.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Functions/processCSVInChunks.js)

**What it does**

- A self-recursing alternative entry point for ingesting the Company Master CSV into **Company Universe**, with the company upsert logic inlined rather than delegated to `processChunk`. It processes the entire file (not just 4000 rows) by re-invoking itself for each successive chunk.
- Takes a `startIndex`; if null it defaults to 0. Downloads the same fixed WorkDrive file (`fileId = "0vc13b6995068458b43dbb10c05a9aaf0cc67"`) via `invokeurl`, splits it on newlines, and drops the header row to get `dataRows`.
- Base case: if `startIndex >= dataRows.size()` it logs `"Company Master Processing Completed. Total Rows: " + dataRows.size()` and returns.
- Otherwise it computes `endIndex = startIndex + chunkSize` (`chunkSize = 1000`, capped at `dataRows.size()`) and slices `chunkRows`.
- For each non-empty row with more than 6 columns, it splits on commas and reads: `Company_Name = values.get(1)`, `Sheet_ISIN_No = values.get(6)`, `Closing_Price = values.get(7)`, `High_Price = values.get(10)`, `Low_Price = values.get(11)`, and `CD_Bloomberg_Code = values.get(4)` (each higher-index read guarded by a size check, defaulting to null). Rows with an empty ISIN are skipped.
- Looks up `Company_Universe[CD_ISIN_No == Sheet_ISIN_No]`. If found, it updates `Company_Name`, `CD_Bloomberg_Code`, `week_High_Date_amount`, `week_Low_Date_amount`, and `Closing_Price`; if not found, it inserts a new `Company_Universe` record with those fields plus `Added_User = zoho.adminuser`.
- Logs `"Processed Company Master rows from " + startIndex + " to " + endIndex`, then recurses via `thisapp.processCSVInChunks(endIndex)` to process the next 1000-row chunk. Returns nothing (`void`).

---
