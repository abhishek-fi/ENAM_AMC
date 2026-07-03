# Form Workflows — Deletion from ENAM Coverage

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Form:** Deletion from ENAM Coverage

This form lets an analyst raise a request to remove a company from ENAM's research coverage. On form load, it prepares the UI by hiding/disabling fields and auto-populating the company, sector, and analyst details from the selected `Company_Universe` record. On submit, it emails the Head of Research (CIO/approver) an HTML approval request containing embedded Approve/Reject action links that route to a public approval page, then closes the form window.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Populate_data` | Populate data | On load of the form | [Populate_data.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_from_ENAM_Coverage/Populate_data.js) |
| 2 | `Send_Email_to_CIO` | Send Email to CIO | On click of Submit | [Send_Email_to_CIO.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_from_ENAM_Coverage/Send_Email_to_CIO.js) |

## Workflow Details

### 1. `Populate data`

- **Link name (file):** `Populate_data`
- **Workflow name:** `Populate data`
- **Trigger / Event:** On load of the form (form-level workflow that runs when the form opens)
- **GitHub:** [Populate_data.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_from_ENAM_Coverage/Populate_data.js)

**What it does**

Prepares the form UI and pre-fills fields from the source company record:

1. **Hides** the fields `Record_ID` and `Enam_Coverage`.
2. **Disables** (makes read-only) the fields `Date_field`, `Dropped_from_Enam_Coverage`, `User_Master`, `Request_Type`, `Company_Name`, and `Sector`.
3. Fetches the corresponding company record: `data = Company_Universe[ID == input.Record_ID]` — i.e. looks up the `Company_Universe` record whose `ID` matches the `Record_ID` passed into the form.
4. Auto-populates form fields from that record:
   - `input.Company_Name` ← `data.Company_Name`
   - `input.Sector` ← `data.Sector`
   - `input.User_Master` ← `data.Analyst2` (the analyst is sourced from the company's `Analyst2` field)

No records are inserted or updated here; this is purely UI setup plus field population. It depends on `Record_ID` already being available on the form when it loads.

---

### 2. `Send Email to CIO`

- **Link name (file):** `Send_Email_to_CIO`
- **Workflow name:** `Send Email to CIO`
- **Trigger / Event:** On click of Submit (form-submit workflow)
- **GitHub:** [Send_Email_to_CIO.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_from_ENAM_Coverage/Send_Email_to_CIO.js)

**What it does**

Builds and sends an HTML approval email to the Head of Research with embedded Approve/Reject links, then closes the form:

1. **Builds the base approval URL** (`baseURL`) pointing to the published Creator page `Deleation_Email_Page` (a `page-perma` public permalink under the app URI, on `https://creatorapp.zohopublic.in`).
2. **Looks up the approver:** `user_dt = User_Master[ID != 0 && Profile == "Head of Research"]` — fetches the `User_Master` record whose `Profile` is "Head of Research". If found (`user_dt != null`), it reads:
   - `name` ← `user_dt.First_Name`
   - `email_id` ← `user_dt.Email_Id`
   - `profile` ← `user_dt.Profile`
   - and logs the email with `info email_id;`.
3. **Gathers request context:**
   - `id = input.Record_ID`
   - `company = input.Company_Name`
   - A commented-out alternative line exists: `// company = Company_Universe[ID == input.Company_Name].Company_Name;` (inactive).
4. **Constructs action links** by appending query params to `baseURL`:
   - `approve_link` = `baseURL + "RecordID=" + id + "&Status=Approve"`
   - `reject_link` = `baseURL + "RecordID=" + id + "&Status=Reject"`
5. **Assembles the HTML email body** (inline-styled): a greeting to `name`, a message stating that an analyst has submitted a request to remove **`company`** from ENAM Coverage and is awaiting approval, followed by centered **Approve** (green `#28a745`) and **Reject** (red `#dc3545`) buttons linking to `approve_link` / `reject_link`, and a sign-off from the "Research Operations Team".
6. **Sends the email** via `sendmail`:
   - **from:** `rms@enamamc.com`
   - **to:** `email_id` (the Head of Research's email)
   - **subject:** `"Approval Request for Deletion "`
   - **message:** the HTML `emailBody`
7. **Closes the form window:** `openUrl("#Script:page.close ","Same window");` — runs a client script to close the current page in the same window.

The actual approve/reject processing is handled elsewhere (on the `Deleation_Email_Page` page, driven by the `RecordID` and `Status` query parameters), not in this workflow.
