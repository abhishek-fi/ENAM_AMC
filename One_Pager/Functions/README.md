# Functions — One Pager Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** One Pager · **Section:** Standalone Functions

These eight standalone functions together build the per-company "one-pager" PDF. The data-prep functions pull content out of a Zoho Sheet workbook: `GetExcelFileCovertToSheetAndRead` finds a company's block (by Bloomberg code) in the Banking / Non-Banking sheets and renders it as an HTML financial-summary table stored on the record's `Block_7_Content`, while `GetValuationChartFromExcel` fetches valuation-chart source data from a second workbook. The chart image itself is drawn by the Node.js function `generateChart`, which builds an SVG P/E chart and uploads it straight to the record's `Valuation_Chart_Image` field via the Creator upload API (using an OAuth token supplied to it). `FI_AB_One_Pager_Static_HTML` then assembles the final print HTML — swapping the freshly-generated valuation-chart image and the price-chart table into the stored `Print_Layout_HTML` — and hands off to `Generate_One_Pager_PDF_to_Workdrive`, which converts that HTML to a PDF and uploads it to a WorkDrive folder (creating the folder if needed). `Initiate_PDF_Combining` is the batch/month-end path: it converts many records' HTML to PDFs and calls the Zoho Writer combine API to merge them into a single multi-page PDF per batch, storing the async `status_url` back on the `One_Pager_Report` record. The two `getAccessToken_*` functions are simple OAuth refresh-token helpers that mint access tokens (one general, one for WorkDrive) used to authorize these API calls.

## Summary

| # | Link name (file) | Function name | Signature | Purpose |
|---|------------------|---------------|-----------|---------|
| 1 | `GetExcelFileCovertToSheetAndRead` | `GetExcelFileCovertToSheetAndRead` | `void GetExcelFileCovertToSheetAndRead(int recId)` | Find a company block in a Zoho Sheet workbook by Bloomberg code and render its financial-summary table as HTML into `Block_7_Content`. |
| 2 | `GetValuationChartFromExcel` | `GetValuationChartFromExcel` | `void GetValuationChartFromExcel(int recId)` | Fetch valuation-chart source cells from a Zoho Sheet workbook (worksheet `AIAE`). |
| 3 | `generateChart` (Node.js) | `module.exports = async (context, basicIO)` | `async (context, basicIO)` | Build an SVG forward-P/E valuation chart from input data and upload it to the record's `Valuation_Chart_Image` field. |
| 4 | `FI_AB_One_Pager_Static_HTML` | `FI_AB_One_Pager_Static_HTML` | `void FI_AB_One_Pager_Static_HTML(int recId)` | Assemble final print HTML: swap the valuation-chart image and price-chart table into `Print_Layout_HTML`, then trigger PDF generation. |
| 5 | `Generate_One_Pager_PDF_to_Workdrive` | `Generate_One_Pager_PDF_to_Workdrive` | `void Generate_One_Pager_PDF_to_Workdrive(int recId)` | Convert the record's print HTML to a PDF and upload it to a WorkDrive folder (creating the folder if missing). |
| 6 | `Initiate_PDF_Combining` | `Initiate_PDF_Combining` | `void Initiate_PDF_Combining(List recordIds, Int batchNumber, String monthYearCode)` | Convert a batch of records to PDFs and merge them via the Zoho Writer combine API; store the async status URL on the report record. |
| 7 | `getAccessToken_FI_AB` | `getAccessToken_FI_AB` | `string getAccessToken_FI_AB()` | Mint a Zoho OAuth access token from a stored refresh token. |
| 8 | `getAccessToken_Workdrive_FI_AB` | `getAccessToken_Workdrive_FI_AB` | `string getAccessToken_Workdrive_FI_AB()` | Mint a WorkDrive-scoped Zoho OAuth access token from a stored refresh token. |

## Function Details

### 1. `GetExcelFileCovertToSheetAndRead`

- **Link name (file):** `GetExcelFileCovertToSheetAndRead`
- **Function name:** `GetExcelFileCovertToSheetAndRead`
- **Signature:** `void GetExcelFileCovertToSheetAndRead(int recId)`
- **GitHub:** [GetExcelFileCovertToSheetAndRead.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/GetExcelFileCovertToSheetAndRead.js)

**What it does**

Prepares the price-chart / financial-summary table for a one-pager record.

1. Loads the `One_Page_Module` record(s) for `recId`, and for each looks up the linked `Company_Universe` record to read its `CD_Bloomberg_Code`.
2. Calls the Zoho Sheet API (`https://sheet.zoho.in/api/v2/<resourceId>`, connection `zoho_oauth_connection`) with `method=find`, `scope=workbook`, `is_exact_match=true` to locate the Bloomberg code inside the workbook (`resourceId = "ln7pj5c000832533d414d8fd741cc8a945b1a"`).
3. From the returned `cells`, it prefers the worksheet named `Non Banking`; if not found, falls back to `Banking`. It records the matched worksheet name, worksheet id, and the row/column indices (row index offset by +2). Banking blocks are assumed one row taller (12 vs 11 rows).
4. Makes a second Zoho Sheet call with `method=range.content.get` to fetch the block's cell range (4 columns: label + 3 data columns).
5. Iterates `range_details` and builds an inline-styled HTML `<table>`, applying different row styling for the title row, the sub-header (Curr Price / M Cap), the main header (Financial Summary, dark-blue background), and the data rows. In data rows, values wrapped in parentheses are colored red (negative-value convention).
6. Writes the resulting HTML into the record field `Block_7_Content` (`data.Block_7_Content = html_string`). This is the price-chart table that `FI_AB_One_Pager_Static_HTML` later injects into `Print_Layout_HTML`.

If no matching Banking/Non-Banking sheet is found, it logs a message and makes no update.

---

### 2. `GetValuationChartFromExcel`

- **Link name (file):** `GetValuationChartFromExcel`
- **Function name:** `GetValuationChartFromExcel`
- **Signature:** `void GetValuationChartFromExcel(int recId)`
- **GitHub:** [GetValuationChartFromExcel.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/GetValuationChartFromExcel.js)

**What it does**

Fetches raw valuation-chart source data from a Zoho Sheet workbook.

1. Builds a param map with `method=worksheet.content.get` for worksheet `AIAE`, range rows 1–15 / columns 1–26, `visible_columns_only=true`.
2. Calls the Zoho Sheet API against the workbook (`resourceId = "hkx0j4559d438ff334ec68150f377253d3140"`, connection `zoho_oauth_connection`) and logs the response.

It does not write anything back to any record. The valuation-chart data that `generateChart` plots is passed in via that function's `iMap` input rather than produced here.

---

### 3. `generateChart` (Node.js)

- **Link name (file):** `generateChart`
- **Function name:** `module.exports = async (context, basicIO)` (Zoho Creator Node.js function)
- **Signature:** `async (context, basicIO)`
- **GitHub:** [generateChart.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/generateChart.js)

**What it does**

A Node.js (not Deluge) function that draws the valuation chart as an SVG and uploads it to the record's image field.

1. Reads its input from `basicIO.getParameter('iMap')` (JSON), expecting: `data` (array of `{Date, PE}` rows), pre-computed `plus1` / `minus1` / `mean` (the +1 STD / -1 STD / mean bands), `title` (company name), `token` (an OAuth access token), and `id` (the Creator record id).
2. Cleans the data (strips commas, parses PE to float, drops non-numeric), and computes an Excel-like "nice number" Y-axis (min/max, step ÷8, 5% padding).
3. Generates a smooth Catmull-Rom-style cubic Bézier path for the P/E series, grid lines, rotated/truncated X-axis date labels, three horizontal reference lines (+1 STD orange, -1 STD gray, mean gold), and a centered legend. The chart title appends "Fwd P/E" if not already present.
4. Assembles a `1100×580` SVG string.
5. Uploads the SVG (as an `image/svg+xml` multipart part named `valuation_chart.svg`) to Zoho Creator via `httpsUploadPng` — a raw `https` request to `POST /creator/v2.1/data/{owner}/{app}/report/{report}/{recordId}/{field}/upload?skip_workflow=["schedules","form_workflow"]` on `www.zohoapis.in`, authorized with `Zoho-oauthtoken <token>`. Target field is `Valuation_Chart_Image` on report `One_Page_Module_Report` in app `research-application-env` (owner `enamamc`).

The uploaded image is what `FI_AB_One_Pager_Static_HTML` later references via its constructed image-download URL. Errors are caught and written back via `basicIO.write("ERROR: ...")`.

---

### 4. `FI_AB_One_Pager_Static_HTML`

- **Link name (file):** `FI_AB_One_Pager_Static_HTML`
- **Function name:** `FI_AB_One_Pager_Static_HTML`
- **Signature:** `void FI_AB_One_Pager_Static_HTML(int recId)`
- **GitHub:** [FI_AB_One_Pager_Static_HTML.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/FI_AB_One_Pager_Static_HTML.js)

**What it does**

Assembles the final print HTML by injecting the generated chart image and price-chart table into the record's stored layout, then triggers PDF generation.

1. Loads the `One_Page_Module` record(s) for `recId`. For each, reads the existing `Print_Layout_HTML` (`block8data`).
2. **Valuation Chart:** builds an image-download URL pointing at the `Valuation_Chart_Image` field on `One_Page_Module_Report` (using `zoho.appuri` and the field's stored filename via `getSuffix("image/").getPrefix(" lowqual")`). It locates the rendered `<div class="print-header">Valuation Chart</div>…<div class="img-container">` anchor block and replaces its `<img>` with a new `<img src="<new_img_url>">`. If the anchor isn't found, it leaves the HTML unchanged and logs it.
3. **Price Chart:** if `Block_7_Content` (produced by `GetExcelFileCovertToSheetAndRead`) is non-empty, it finds the `<div class="print-header">Price Chart</div>…<div class="table-fit">` anchor and swaps in `Block_7_Content`. If the anchor isn't found, it logs and leaves it unchanged.
4. Saves the rebuilt HTML back to `Print_Layout_HTML`.
5. After the loop, calls `thisapp.Generate_One_Pager_PDF_to_Workdrive(one.ID)` to produce and upload the PDF (see #5).

---

### 5. `Generate_One_Pager_PDF_to_Workdrive`

- **Link name (file):** `Generate_One_Pager_PDF_to_Workdrive`
- **Function name:** `Generate_One_Pager_PDF_to_Workdrive`
- **Signature:** `void Generate_One_Pager_PDF_to_Workdrive(int recId)`
- **GitHub:** [Generate_One_Pager_PDF_to_Workdrive.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/Generate_One_Pager_PDF_to_Workdrive.js)

**What it does**

Converts a record's print HTML to a PDF and uploads it to WorkDrive. Called at the end of `FI_AB_One_Pager_Static_HTML` (#4).

1. Loads the `One_Page_Module` record for `recId`. Guards against non-production environments: if `zoho.appuri` contains `"environment"`, it returns early.
2. Builds the target file/folder names: `subFolderName = <Company_Name> + " - " + <Added_Time as "MMMM yyyy">`, `fileName = subFolderName + ".pdf"` (also URL-encoded).
3. Converts the stored `Print_Layout_HTML` to a PDF via `zoho.file.convertToPDF(content)`.
4. Sends a debug `sendmail` (from `rms@enamamc.com` to `abhishek@fristinetech.com`) attaching the generated PDF.
5. Resolves the WorkDrive folder: uses `oneRec.Workdrive_Folder_ID` if set; otherwise creates a subfolder under the parent folder id `hkx0jd92cea3d216e4b5ca9bca83621a6978d` via `zoho.workdrive.createFolder(..., "zoho_workdrive_connection")` and stores the new folder id back on the record.
6. Uploads the PDF into that folder via `zoho.workdrive.uploadFile(pdf, folderId, fileName, false, "zoho_workdrive_connection")`, wrapped in try/catch. On success it extracts `data[0].attributes.resource_id` and stores it in `File_Resource_Id`.

---

### 6. `Initiate_PDF_Combining`

- **Link name (file):** `Initiate_PDF_Combining`
- **Function name:** `Initiate_PDF_Combining`
- **Signature:** `void Initiate_PDF_Combining(List recordIds, Int batchNumber, String monthYearCode)`
- **GitHub:** [Initiate_PDF_Combining.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/Initiate_PDF_Combining.js)

**What it does**

The batch / month-end path: merges many one-pagers into a single combined PDF via the Zoho Writer combine API.

1. Computes `monthLabel` as the previous month (`zoho.currentdate.subMonth(1)` as `"MMM yyyy"`).
2. For each record id in `recordIds`: re-fetches the `One_Page_Module` record, converts its `Print_Layout_HTML` to a PDF (`zoho.file.convertToPDF`), and adds it as a multipart file part. Part names follow the Writer convention: first file is `files`, subsequent are `files1`, `files2`, … Each file is limited to pages `1,2` via per-file `input_options` (`page_ranges = "1,2"`). Per-record failures are caught and logged so the batch continues.
3. If no valid PDFs were collected, logs and returns.
4. Builds `output_settings` — combined file name `OnePagers-<monthLabel>-Batch-<batchNumber>.pdf`, destination `folder_id = "kftie8153e640d77f419b9d16e6ba4d8a9ad9"`, `overwrite_existing_file = false` — and adds `output_settings` and `input_options` as JSON string parts.
5. Calls the Zoho Writer combine API: `POST https://www.zohoapis.in/writer/api/v1/documents/pdf/combine/store` (connection `zoho_oauth_connection`) with the assembled `files` list.
6. Parses the response; if it contains a `status_url` (async job), it upserts into `One_Pager_Report` keyed by `Month_Year_Code == monthYearCode`, writing the URL into `Part_1_Status_Link` … `Part_5_Status_Link` according to `batchNumber`. Batch numbers beyond 5 are logged as unsupported. Parse/save failures are caught and logged.

This function converts `Print_Layout_HTML` directly and does not call `FI_AB_One_Pager_Static_HTML` first, so it assumes the layout HTML was already assembled for each record.

---

### 7. `getAccessToken_FI_AB`

- **Link name (file):** `getAccessToken_FI_AB`
- **Function name:** `getAccessToken_FI_AB`
- **Signature:** `string getAccessToken_FI_AB()`
- **GitHub:** [getAccessToken_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/getAccessToken_FI_AB.js)

**What it does**

OAuth helper. Makes a `POST` to `https://accounts.zoho.in/oauth/v2/token` with `grant_type=refresh_token` (client id, client secret, and refresh token in the query string), reads `access_token` from the response, logs the full response, and returns the token. Used to authorize API calls (e.g. the token passed into `generateChart` via `iMap`).

---

### 8. `getAccessToken_Workdrive_FI_AB`

- **Link name (file):** `getAccessToken_Workdrive_FI_AB`
- **Function name:** `getAccessToken_Workdrive_FI_AB`
- **Signature:** `string getAccessToken_Workdrive_FI_AB()`
- **GitHub:** [getAccessToken_Workdrive_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/Functions/getAccessToken_Workdrive_FI_AB.js)

**What it does**

Same as #7 but with a distinct (WorkDrive-scoped) set of OAuth credentials. `POST`s to `https://accounts.zoho.in/oauth/v2/token` with `grant_type=refresh_token`, extracts and returns `access_token`, and logs the response. Provides a WorkDrive-authorized access token for WorkDrive operations.

---
