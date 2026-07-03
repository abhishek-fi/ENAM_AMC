# Form Workflows — Morning Meeting Notes

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Morning Meeting Notes

This form captures each analyst's participation in a morning meeting — whether they attended, in what mode, and (if they did) their morning notes (sector/company observations, portfolio-stock and new-idea flags). The workflows enforce role-based access on record creation, disable key fields during edits, mandate conditional fields (meeting mode vs. not-attended reason, and sector-related fields), set default values and hide subform columns on load, and — on successful submission — sync the analyst's attendance back into the linked Meeting Details record and roll "not attending" entries up into a master record. In addition to the 8 Deluge workflows, there are 3 no-code **Field rule** workflows (configured via Zoho Creator) that show/hide fields and lock the notes subform.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `FI_AB_Add_Not_Attending_R` | FI_AB Add Not Attending Reason to Master | Created — Successful form submission | [FI_AB_Add_Not_Attending_R.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/FI_AB_Add_Not_Attending_R.js) |
| 2 | `FI_AB_Disable_fields_whil` | FI_AB Disable fields while editing | Edited — Load of the form | [FI_AB_Disable_fields_whil.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/FI_AB_Disable_fields_whil.js) |
| 3 | `Mandate_fields1` | Mandate fields | Created or Edited — Validations on form submission | [Mandate_fields1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Mandate_fields1.js) |
| 4 | `No_one_to_be_create_recor` | No one to be create record from the form | Created — Load of the form | [No_one_to_be_create_recor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/No_one_to_be_create_recor.js) |
| 5 | `Raised_request_default_va` | Raised request default value | Created or Edited — Load of the form | [Raised_request_default_va.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Raised_request_default_va.js) |
| 6 | `set_mandatory_field_valid` | set mandatory field validation | Created or Edited — Validations on form submission | [set_mandatory_field_valid.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/set_mandatory_field_valid.js) |
| 7 | `update_meeting_details_in` | update meeting details in subfrom | Created or Edited — Successful form submission | [update_meeting_details_in.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/update_meeting_details_in.js) |
| 8 | `update_new_Idea` | update new Idea | Created or Edited — User input of Morning Notes.Portfolio_Stock | [update_new_Idea.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/update_new_Idea.js) |
| 9 | `Hide_and_show_fields` (screenshot) | Hide and show fields | Created or Edited · Field rule (form load & field input) | [Hide_and_show_fields.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Hide_and_show_fields.png) |
| 10 | `Hide_meeting_notes_subfor1` (screenshot) | Hide meeting notes subform | Created or Edited · Field rule (form load & field input) | [Hide_meeting_notes_subfor1.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Hide_meeting_notes_subfor1.png) |
| 11 | `Meeting_Notes_Subform_Add` (screenshot) | Meeting Notes Subform Add and Delete Entry Hide | Created or Edited · Field rule (form load & field input) | [Meeting_Notes_Subform_Add.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Meeting_Notes_Subform_Add.png) |

## Workflow Details

### 1. `FI_AB Add Not Attending Reason to Master`

- **Link name (file):** `FI_AB_Add_Not_Attending_R`
- **Workflow name:** `FI_AB Add Not Attending Reason to Master`
- **Trigger / Event:** Created — Successful form submission
- **GitHub:** [FI_AB_Add_Not_Attending_R.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/FI_AB_Add_Not_Attending_R.js)

**What it does**

When a new record is submitted for someone who did **not** attend, this workflow records that fact in a per-meeting master record.

- Runs only when `Have_you_attended_today_s_meeting == "No"` **and** `Meeting_Detail` is not null.
- Looks up a `Morning_Meeting_Notes_Master` record for the same `Meeting_Detail`.
- If no master record exists for that meeting, it inserts one, setting `Added_User` to the logged-in user (`zoho.loginuser`) and `Meeting_Detail` to the submitted meeting, then re-fetches it.
- Builds a collection from the master's existing `Not_Attended_List` values, adds the current record's `ID` to it, and writes the updated list back to the master's `Not_Attended_List`.

Net effect: each master record (one per meeting) accumulates the list of Morning Meeting Notes records belonging to analysts who did not attend.

---

### 2. `FI_AB Disable fields while editing`

- **Link name (file):** `FI_AB_Disable_fields_whil`
- **Workflow name:** `FI_AB Disable fields while editing`
- **Trigger / Event:** Edited — Load of the form
- **GitHub:** [FI_AB_Disable_fields_whil.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/FI_AB_Disable_fields_whil.js)

**What it does**

On opening an existing record for edit, it locks down the core identity/attendance fields so they cannot be changed after creation. Disabled fields:

- `Meeting_Detail`
- `Have_you_attended_today_s_meeting`
- `Mode`
- `Not_attended_reason`
- `Analyst`
- `Status`

---

### 3. `Mandate fields`

- **Link name (file):** `Mandate_fields1`
- **Workflow name:** `Mandate fields`
- **Trigger / Event:** Created or Edited — Validations on form submission
- **GitHub:** [Mandate_fields1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Mandate_fields1.js)

**What it does**

Conditionally requires a field depending on the attendance answer, blocking submission if it is missing.

- If `Have_you_attended_today_s_meeting == "Yes"` and `Mode` is null → alert **"Please select meeting mode"** and `cancel submit`.
- If `Have_you_attended_today_s_meeting == "No"` and `Not_attended_reason` is null → alert **"Please provide not attendded meeting reson"** (message text as in code) and `cancel submit`.

---

### 4. `No one to be create record from the form`

- **Link name (file):** `No_one_to_be_create_recor`
- **Workflow name:** `No one to be create record from the form`
- **Trigger / Event:** Created — Load of the form
- **GitHub:** [No_one_to_be_create_recor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/No_one_to_be_create_recor.js)

**What it does**

Effectively blocks manual record creation from this form for all users. When the form loads in create mode it disables every field and shows a blocking alert. Disabled fields:

- `Have_you_attended_today_s_meeting`
- `Modification_Submitted`
- `Approver_Name`
- `Submission_Remarks`
- `Status`
- `Analyst`
- `Meeting_Detail`
- `Mode`
- `Not_attended_reason`

Then shows the alert **"You do not have access to create record!"**. (Records are expected to be created programmatically rather than by hand.)

---

### 5. `Raised request default value`

- **Link name (file):** `Raised_request_default_va`
- **Workflow name:** `Raised request default value`
- **Trigger / Event:** Created or Edited — Load of the form
- **GitHub:** [Raised_request_default_va.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Raised_request_default_va.js)

**What it does**

On form load (create or edit):

- Sets `Raised_Request` to `false` by default.
- Hides the `Meet_Note` column of the `Morning_Notes` subform.
- (A `hide Morning_Notes.Meeting_Notes;` line is present but commented out, so it does not run.)

---

### 6. `set mandatory field validation`

- **Link name (file):** `set_mandatory_field_valid`
- **Workflow name:** `set mandatory field validation`
- **Trigger / Event:** Created or Edited — Validations on form submission
- **GitHub:** [set_mandatory_field_valid.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/set_mandatory_field_valid.js)

**What it does**

Enforces required subform fields when the entry is sector-level. For a `Morning_Notes` subform row where `Company_Sector == "Sector"`:

- If `Sector_Name` is null → alert **"Please select sector name"** and `cancel submit`.
- If `Tag` is null → alert **"Please enter value in Tag"** and `cancel submit`.

Note: the code references `input.Morning_Notes.<field>` (subform prefix without explicit row iteration), so these checks operate on the subform's field input as evaluated by the form.

---

### 7. `update meeting details in subfrom`

- **Link name (file):** `update_meeting_details_in`
- **Workflow name:** `update meeting details in subfrom`
- **Trigger / Event:** Created or Edited — Successful form submission
- **GitHub:** [update_meeting_details_in.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/update_meeting_details_in.js)

**What it does**

Pushes this analyst's attendance answer back into the linked `Meeting_Details` record's attendance subform.

- Fetches the `Meeting_Details` record matching `input.Meeting_Detail` (and logs it via `info`).
- Iterates the `Analyst_Meeting_Attendance` subform rows; when a row's `Analyst_Name.ID` matches the submitted `Analyst.ID`, it updates that row:
  - `Have_you_attended_today_s_meeting` ← submitted value
  - `Mode` ← submitted `Mode`
  - `Attended_Mode` ← submitted `Mode`
  - `Not_Attended_Reason` ← submitted `Not_attended_reason`
  - Commits the row with `row.update(...)` and breaks the loop.
- Finally calls the application function `thisapp.workflow_test();`.

---

### 8. `update new Idea`

- **Link name (file):** `update_new_Idea`
- **Workflow name:** `update new Idea`
- **Trigger / Event:** Created or Edited — User input of `Morning_Notes.Portfolio_Stock`
- **GitHub:** [update_new_Idea.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/update_new_Idea.js)

**What it does**

A field-level action on the `Morning_Notes` subform: when the user sets `Portfolio_Stock` to `"Yes"`, it automatically sets `New_Ideas` to `"No"` for that row (a portfolio stock cannot also be flagged as a new idea).

---

## Field Rule Workflows (no-code configuration)

These workflows are built with Zoho Creator's built-in **Field rules** (no Deluge script). Their actions execute on form load and whenever a field participating in a condition is changed by the user. The linked screenshots capture the exact configuration.

### 9. `Hide and show fields`

- **Link name (file):** `Hide_and_show_fields` (screenshot)
- **Workflow name:** `Hide and show fields`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Hide_and_show_fields.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Hide_and_show_fields.png)

**What it does**

Shows/hides fields based on the attendance answer, and always hides the internal fields:

- **If `Have_you_attended_today_s_meeting` contains "Yes":** show **Mode**, hide **Not_attended_reason**.
- **If it contains "No":** show **Not_attended_reason**, hide **Mode**.
- **Always (no condition):** hide **Developer_Section**.
- **Always (no condition):** hide **Raised_Request**.

---

### 10. `Hide meeting notes subform`

- **Link name (file):** `Hide_meeting_notes_subfor1` (screenshot)
- **Workflow name:** `Hide meeting notes subform`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Hide_meeting_notes_subfor1.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Hide_meeting_notes_subfor1.png)

**What it does**

Hides the notes subform when the analyst did not attend:

- **If `Have_you_attended_today_s_meeting == "No"`:** hide the **Morning_Notes** subform (a non-attendee has no notes to record).

---

### 11. `Meeting Notes Subform Add and Delete Entry Hide`

- **Link name (file):** `Meeting_Notes_Subform_Add` (screenshot)
- **Workflow name:** `Meeting Notes Subform Add and Delete Entry Hide`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Meeting_Notes_Subform_Add.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes/Meeting_Notes_Subform_Add.png)

**What it does**

Runs unconditionally ("Execute without condition") and locks the row structure of the **Morning_Notes** subform:

- **Hide subform add entry** for `Morning_Notes` — users cannot add new rows.
- **Hide subform delete entry** for `Morning_Notes` — users cannot delete existing rows.
