# Form Workflows — File Upload for One Pager

> **App:** ENAM AMC (Zoho Creator) · **Module:** One Pager · **Form:** File Upload for One Pager

This form holds two file uploads — a Price Chart and a Valuation Chart — that are pushed to Zoho WorkDrive on successful submission. A single on-create workflow uploads both attached files to a fixed WorkDrive folder via the `zoho.workdrive.uploadFile` connector, captures each returned Permalink, and — if both uploads succeed — flags the record as successfully uploaded.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Upload_File_to_Workdrive1` | Upload File to Workdrive | On Create — successful form submission | [Upload_File_to_Workdrive1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/File_Upload_for_One_Pager/Upload_File_to_Workdrive1.js) |

## Workflow Details

### 1. `Upload File to Workdrive`

- **Link name (file):** `Upload_File_to_Workdrive1`
- **Workflow name:** `Upload File to Workdrive`
- **Trigger / Event:** On Create — runs on successful form submission (`Created - Successful form submission`)
- **GitHub:** [Upload_File_to_Workdrive1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/File_Upload_for_One_Pager/Upload_File_to_Workdrive1.js)

**What it does**

1. Reads the two file fields from the submitted record: `Price_Chart` (into `priceFile`) and `Valuation_Chart` (into `valuationFile`).
2. Uploads the price file to WorkDrive using `zoho.workdrive.uploadFile(priceFile, "k5zpva7ac367e3d554ea99e4a61f3816ffd01", "Price Table 2.xlsx", true, "zoho_workdrive_connection")`, where:
   - `k5zpva7ac367e3d554ea99e4a61f3816ffd01` is the destination WorkDrive folder ID.
   - `"Price Table 2.xlsx"` is the upload filename.
   - `true` is the override-name-conflict flag.
   - `zoho_workdrive_connection` is the Zoho connection used.
3. Extracts the uploaded file's Permalink from the response into `pricePermalink` via `fileUploadResponse.get("data").get(0).get("attributes").get("Permalink")`.
4. Uploads the valuation file the same way, into the **same folder ID** (`k5zpva7ac367e3d554ea99e4a61f3816ffd01`) with the filename `"Valuation Chart 2.xlsx"`, and extracts its Permalink into `valuationPermalink`.
5. If both `pricePermalink` and `valuationPermalink` are non-empty, it logs `"Files uploaded successfully"` (via `info`) and sets the record field `Files_Uploaded_Successfully = true`.

**Fields / data touched**

- **Reads:** `Price_Chart`, `Valuation_Chart` (file upload fields).
- **Writes:** `Files_Uploaded_Successfully` (checkbox/boolean), set to `true` only when both uploads return a Permalink.
- **External:** Zoho WorkDrive, folder ID `k5zpva7ac367e3d554ea99e4a61f3816ffd01`, connection `zoho_workdrive_connection`.

**Notes**

- The two returned Permalinks (`pricePermalink`, `valuationPermalink`) are captured into local variables and used for the success check.
- The destination filenames are `"Price Table 2.xlsx"` and `"Valuation Chart 2.xlsx"`, both uploaded to folder ID `k5zpva7ac367e3d554ea99e4a61f3816ffd01` (the `true` override flag governs conflict handling).
