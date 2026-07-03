# Form Workflows — Deletion From Focus List

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Form:** Deletion From Focus List

These two workflows drive the "Deletion From Focus List" request form. On form load, the first workflow pre-populates and locks the request fields by looking up the source `Company_Universe` record so the analyst sees read-only company details. On submission, the second workflow builds an HTML approval email — with embedded Approve/Reject links back into a Zoho Creator page — and emails it to the CIO (plus a hard-coded developer address) for review, then closes the form page.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Populate_data_form_compan` | Populate data form company universe | Load of the form | [Populate_data_form_compan.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_From_Focus_List/Populate_data_form_compan.js) |
| 2 | `Send_Email_to_CIO1` | Send Email to CIO | Click of Submit | [Send_Email_to_CIO1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_From_Focus_List/Send_Email_to_CIO1.js) |

## Workflow Details

### 1. `Populate data form company universe`

- **Link name (file):** `Populate_data_form_compan`
- **Workflow name:** `Populate data form company universe`
- **Trigger / Event:** On load of the form (Deletion From Focus List)
- **GitHub:** [Populate_data_form_compan.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_From_Focus_List/Populate_data_form_compan.js)

**What it does**

- Hides the `Record_ID` field on the form.
- Disables (makes read-only) the fields `Date_field`, `Company_Name`, `Sector`, `Request_Type`, and `Analyst_Name`.
- Looks up the source record in the `Company_Universe` form/report where its `ID` matches the incoming `input.Record_ID`, storing it in `data`.
- Pre-fills the form from that record:
  - `input.Company_Name` = `data.Company_Name`
  - `input.Sector` = `data.Sector`
  - `input.Analyst_Name` = `data.Analyst2` (note the source field is `Analyst2`)
- No null-check is performed on `data`; if `input.Record_ID` does not match a `Company_Universe` record the field assignments would fail/return blank.

---

### 2. `Send Email to CIO`

- **Link name (file):** `Send_Email_to_CIO1`
- **Workflow name:** `Send Email to CIO`
- **Trigger / Event:** On click of Submit (successful form submission)
- **GitHub:** [Send_Email_to_CIO1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Deletion_From_Focus_List/Send_Email_to_CIO1.js)

**What it does**

- Builds `baseURL` pointing to a published Zoho Creator page (`page-perma/Deletion_Focus_List_Page/...`) using `zoho.appuri`, with a trailing `?` so query parameters can be appended.
- Fetches a CIO user from `User_Master` where `ID != 0 && Profile == "CIO"` into `user_dt`.
  - If `user_dt` is not null, it reads `name` (`First_Name`), `email_id` (`Email_Id`), and `profile` (`Profile`) from that user. An `info email_id;` line is commented out.
  - Note: `name` and `email_id` are only assigned inside the `if(user_dt != null)` block; if no CIO user is found they remain unset.
- Constructs two action deep-links using `input.Record_ID`:
  - `approve_link` = `baseURL + "RecordID=" + id + "&Status=Approve"`
  - `reject_link` = `baseURL + "RecordID=" + id + "&Status=Reject"`
- Assembles an inline-styled HTML `emailBody` addressed to the CIO (`name`), stating an analyst has submitted a "Company Universe Deletion Request" from the Focus List, showing the `input.Company_Name`, and rendering two centered buttons: a green **Approve** button linking to `approve_link` and a red **Reject** button linking to `reject_link`. Signed off as "Research Operations Team".
- Sends the email twice via `sendmail`:
  1. **From** `rms@enamamc.com` **To** `email_id` (the CIO) — **Subject:** `Approval Request for Deletion ` — **Message:** `emailBody`.
  2. **From** `rms@enamamc.com` **To** `abhishek@fristinetech.com` (hard-coded developer/test address) — same subject and body.
- Finally calls `openUrl("#Script:page.close ","Same window")` to close the current form page in the same window.
