# Report Workflows — Morning Meeting Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Section:** Report Workflows

This section holds the report-level action workflows for the Morning Meeting module. They cover the full lifecycle of an analyst's morning meeting note: submitting a draft note into the current (or next) meeting, and the "edit request" approval loop that lets an analyst request permission to edit an already-submitted note. The edit-request loop consists of an analyst raising a request (which emails the Head of Research), and the approver either approving it (which unlocks the note for editing and emails the analyst an edit link) or rejecting it (which emails the analyst a rejection). Two older workflows for the same flow are marked **Not in use**.

## Summary

| # | Link name (file) | Workflow name | Report | Trigger | Status | GitHub |
|---|------------------|---------------|--------|---------|--------|--------|
| 1 | `FI_AB_Submit_to_current_m` | FI_AB Submit to current meeting | My Drafts | Click of action item: Submit Note | In use | [FI_AB_Submit_to_current_m.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/FI_AB_Submit_to_current_m.js) |
| 2 | `Raise_Notes_Edit_Request` | Raise Notes Edit Request | My Submitted Notes | Click of action item: Raise Edit Request | In use | [Raise_Notes_Edit_Request.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/Raise_Notes_Edit_Request.js) |
| 3 | `meeting_notes_edit_approv` | meeting notes edit approve | Meeting Notes Edit Request Report | Click of action item: Approve | In use | [meeting_notes_edit_approv.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/meeting_notes_edit_approv.js) |
| 4 | `Meeting_notes_edit_reject` | Meeting notes edit rejection | Meeting Notes Edit Request Report | Click of action item: (reject) | In use | [Meeting_notes_edit_reject.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/Meeting_notes_edit_reject.js) |
| 5 | `approval_for_meeting_note` | approval for meeting notes edit | Morning Meeting Notes Report | Click of action item: Raise Edit Request | Not in use | [approval_for_meeting_note.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/approval_for_meeting_note.js) |
| 6 | `edit_notes1` | edit_notes | Morning Meeting Notes Report | Click of action item | Not in use | [edit_notes1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/edit_notes1.js) |

## Workflow Details

### 1. `FI_AB_Submit_to_current_m`

- **Workflow name:** `FI_AB Submit to current meeting`
- **Report / Trigger:** Morning Notes — In My Drafts report — On click of action item: Submit Note
- **Status:** In use
- **GitHub:** [FI_AB_Submit_to_current_m.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/FI_AB_Submit_to_current_m.js)

**What it does**

Submits a draft morning note into the correct meeting after validating that all mandatory fields are filled, then links the note to the meeting's master and per-analyst records and marks it as stored.

- Runs mandatory-field validation depending on the note type:
  - Always requires `Meet_Note` to be non-empty.
  - For a **Company** note: requires `Company_Name`, `Recommendation`, `Event_update`, `Portfolio_Stock`, `New_Ideas`, `Topic_Header`, and `Outlook_View`; and if `Price_as_on` is set, `Target_price` must not be 0.
  - For a **Sector** note: requires `Sector_Name`, `Event_update`, `New_Ideas`, `Topic_Header`, `Tag`, and `Outlook_View`.
  - If validation fails it shows "Please fill all the mandatory fields!" and stops.
- Determines the target meeting: if the current time is at/after 11:30, it targets **tomorrow's** meeting (`Meeting_Date == today + 1`); otherwise it targets **today's** meeting. (Note: the hour/minute check uses a combined `>=` condition.)
- If a meeting is found, it ensures a `Morning_Meeting_Notes_Master` record exists for that meeting (creating one via `insert into` if none exists), and ensures a per-analyst `Morning_Meeting_Notes` record exists (creating one if none exists).
- Writes back onto the current record: links `Meeting_Detail`, `Morning_Meeting_Notes`, and `Morning_Meeting_Notes_Master`; sets `Record_Status1 = "Stored"`, `Submission_Date_Time = now`, and `Edit_Access = true`.
- Shows a success message with the note's `Topic_Header`.

### 2. `Raise_Notes_Edit_Request`

- **Workflow name:** `Raise Notes Edit Request`
- **Report / Trigger:** Morning Notes — In My Submitted Notes report — On click of action item: Raise Edit Request
- **Status:** In use
- **GitHub:** [Raise_Notes_Edit_Request.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/Raise_Notes_Edit_Request.js)

**What it does**

Lets an analyst request permission to edit an already-submitted morning note. It creates an edit-request record and emails the Head of Research a review link.

- Reads the selected `Morning_Notes` record by `input.ID` and iterates over it.
- For the note, inserts a `Meeting_Notes_Edit_Request` record capturing: `Added_User` (login user), `Analyst_Name` (the note's Analyst), `Company_Name` (the note's company ID), `Edit_Request_Raise_Time` (now), `Meet_Note`, and `Ref_Record` (the source note ID).
- Looks up the recipient from `User_Master` for the Research Head (`Profile == "Head of Research" || Profile == "HoR" && User_Status == "Active"`) and builds a link to the newly created edit-request record in the Meeting Notes Edit Request Report.
- Sends an email from `rms@enamamc.com` to the Research Head, subject "Meeting Notes Edit Request Raised", containing the analyst name, company name, the meeting note text, and a "View Record" link to approve.
- Note: it sets a local variable `Raised_Request = true` (not `input.Raised_Request`), so unlike workflow #5 it does not flag the source record.

### 3. `meeting_notes_edit_approv`

- **Workflow name:** `meeting notes edit approve`
- **Report / Trigger:** Meeting Notes Edit Request — In Meeting Notes Edit Request Report — On click of action item: Approve
- **Status:** In use
- **GitHub:** [meeting_notes_edit_approv.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/meeting_notes_edit_approv.js)

**What it does**

Approves an analyst's edit request: it unlocks the underlying morning note for editing and emails the analyst a link to update it.

- Reads the `Meeting_Notes_Edit_Request` record by `input.ID`.
- Loads the referenced `Morning_Notes` record (via `input.Ref_Record`) and sets `Edit_Access = true` and `Edit_Access_Date_Time = now`, unlocking it for editing.
- On the edit-request record, sets both `Approved = true` and `Rejection = true`.
- If the edit request exists, it resolves the analyst's name and email, builds a record-edit link into `My_Morning_Notes_Report` for the referenced note, and emails the analyst from `rms@enamamc.com` (subject "Meeting Notes Edit Request Approved – Action Required") telling them the request was approved and providing the "click here" link to update the note.
- If the edit request is not found, it shows "Meeting Notes Edit Request not found."
- Note: the `morning_meeting_notes` lookup on line 15 is computed but not otherwise used; an approval-comment popup flow is present but commented out.

### 4. `Meeting_notes_edit_reject`

- **Workflow name:** `Meeting notes edit rejection`
- **Report / Trigger:** Meeting Notes Edit Request — In Meeting Notes Edit Request Report — On click of action item (rejection)
- **Status:** In use
- **GitHub:** [Meeting_notes_edit_reject.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/Meeting_notes_edit_reject.js)

**What it does**

Rejects an analyst's edit request and notifies the analyst by email.

- Reads the `Meeting_Notes_Edit_Request` record by `input.ID`.
- On the edit-request record, sets `Rejection = true` and `Approved = true`.
- If the record exists, resolves the analyst's name and email and sends a rejection email from `rms@enamamc.com` (subject "Meeting Notes Edit Request Rejected") telling the analyst the request was rejected by the Research Approver and to review/make changes per guidelines.
- If the record is not found, shows "Meeting Notes Edit Request not found."
- Unlike the approval workflow, it does **not** change any edit-access flag on the underlying note.

### 5. `approval_for_meeting_note`

- **Workflow name:** `approval for meeting notes edit`
- **Report / Trigger:** Morning Meeting Notes — In Morning Meeting Notes Report — On click of action item: Raise Edit Request
- **Status:** Not in use (marked "Not in use" in the first-line comment)
- **GitHub:** [approval_for_meeting_note.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/approval_for_meeting_note.js)

**What it does**

An older/superseded version of the "raise edit request" flow that operated on `Morning_Meeting_Notes` records (rather than `Morning_Notes`). It is **not in use** — its behaviour is now handled by workflow #2 (`Raise_Notes_Edit_Request`).

- Reads the `Morning_Meeting_Notes` record by `input.ID` and sets `input.Raised_Request = true`.
- Iterates over the note and inserts a `Meeting_Notes_Edit_Request` record using nested `Morning_Notes` sub-fields (`Company_Name`, `Meet_Note`); note it does not set `Ref_Record`.
- Looks up the Research Head email (`Profile == "Head of Research" && User_Status == "Active"`) and emails a "Meeting Notes Edit Request Raised" notification from `rms@enamamc.com` with analyst name, company, the note text, and a review link.

### 6. `edit_notes1`

- **Workflow name:** `edit_notes`
- **Report / Trigger:** Morning Meeting Notes — In Morning Meeting Notes Report — On click of action item
- **Status:** Not in use (marked "Not in use" in the first-line comment)
- **GitHub:** [edit_notes1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Report_Workflows/edit_notes1.js)

**What it does**

A one-line helper (**not in use**) that opens the `Edit_Notes` page in a new window for the selected record, passing the record ID via `recid`.

- Calls `openUrl(...#Page:Edit_Notes?recid=<input.ID>, "new window")`.

---
