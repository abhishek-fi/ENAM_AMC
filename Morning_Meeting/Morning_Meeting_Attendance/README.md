# Form Workflows — Morning Meeting Attendance

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Morning Meeting Attendance

This form captures each analyst's attendance response for a Morning Meeting ("Will you be able to join tomorrow's meeting?"), along with the mode, location, and reason for not attending. The workflows enforce that only the system account can create/edit records, mandate conditional fields based on the attendance answer, mirror the response back into the parent Meeting Details record's attendance sub-form, maintain a "not applied" list in the Master, and redirect the user to the attendance report after submission. Alongside the 8 Deluge workflows there are 2 no-code **Field rule** workflows (configured via Zoho Creator) that hide the developer section and show/hide the mode/reason/location fields based on the attendance answer.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `FI_AB_Update_Not_Applied_` | FI_AB Update Not Applied List in Master | Created or Edited · Successful form submission | [FI_AB_Update_Not_Applied_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/FI_AB_Update_Not_Applied_.js) |
| 2 | `FI_AB_Update_Not_Applied_1` | FI_AB Update Not Applied List in Master | Edited · Update of "Will you be able to join tomorrow's meeting?" field | [FI_AB_Update_Not_Applied_1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/FI_AB_Update_Not_Applied_1.js) |
| 3 | `Mandate_fields` | Mandate fields | Created or Edited · Validations on form submission | [Mandate_fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Mandate_fields.js) |
| 4 | `Meeting_joining_attendanc` | Meeting joining attendance status blank | Created or Edited · Validations on form submission | [Meeting_joining_attendanc.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Meeting_joining_attendanc.js) |
| 5 | `Not_able_to_create_record` | Not able to create record directedly from the form | Created · Load of the form | [Not_able_to_create_record.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Not_able_to_create_record.js) |
| 6 | `Not_editable_meeting_deta` | Not editable meeting details and Analyst | Created or Edited · Load of the form | [Not_editable_meeting_deta.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Not_editable_meeting_deta.js) |
| 7 | `Redirect_to_the_meeting_p` | Redirect to the meeting page | Created or Edited · Successful form submission | [Redirect_to_the_meeting_p.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Redirect_to_the_meeting_p.js) |
| 8 | `data_populate_in_meeting_` | data populate in meeting details subfrom | Created or Edited · Successful form submission | [data_populate_in_meeting_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/data_populate_in_meeting_.js) |
| 9 | `Hide_Developer_Section` (screenshot) | Hide Developer Section | Created or Edited · Field rule (form load & field input) | [Hide_Developer_Section.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Hide_Developer_Section.png) |
| 10 | `show_and_hide_fields` (screenshot) | show and hide fields | Created or Edited · Field rule (form load & field input) | [show_and_hide_fields.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/show_and_hide_fields.png) |

## Workflow Details

### 1. `FI_AB Update Not Applied List in Master`

- **Link name (file):** `FI_AB_Update_Not_Applied_`
- **Workflow name:** `FI_AB Update Not Applied List in Master`
- **Trigger / Event:** Created or Edited — on successful form submission
- **GitHub:** [FI_AB_Update_Not_Applied_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/FI_AB_Update_Not_Applied_.js)

**What it does**

After a record is created or edited, if the analyst has not given a positive response to attend, this calls a Master-level function to refresh a "not applied" list.

- Condition: runs when `Will_you_be_able_to_join_tomorrow` is blank or equal to `"Not Responded"` **and** a `Meeting_Detail` is linked.
- Action: calls the app-level function `thisapp.FI_AB_Update_Not_Applied_List(input.Meeting_Detail)`, passing the linked meeting detail so the Master's "not applied" list is updated.

---

### 2. `FI_AB Update Not Applied List in Master`

- **Link name (file):** `FI_AB_Update_Not_Applied_1`
- **Workflow name:** `FI_AB Update Not Applied List in Master`
- **Trigger / Event:** Edited — on update of the field "Will you be able to join tomorrow's meeting?"
- **GitHub:** [FI_AB_Update_Not_Applied_1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/FI_AB_Update_Not_Applied_1.js)

**What it does**

Identical logic to workflow #1, but triggered specifically when the `Will_you_be_able_to_join_tomorrow` field value changes (field-level update event) rather than on full submission.

- Condition: runs when `Will_you_be_able_to_join_tomorrow` is blank or equal to `"Not Responded"` **and** a `Meeting_Detail` is linked.
- Action: calls `thisapp.FI_AB_Update_Not_Applied_List(input.Meeting_Detail)` to refresh the Master "not applied" list.

---

### 3. `Mandate fields`

- **Link name (file):** `Mandate_fields`
- **Workflow name:** `Mandate fields`
- **Trigger / Event:** Created or Edited — validations on form submission
- **GitHub:** [Mandate_fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Mandate_fields.js)

**What it does**

Enforces conditionally mandatory fields based on the attendance answer, blocking submission if the required field is empty.

- If `Will_you_be_able_to_join_tomorrow == "Yes"` and `Mode` is empty: alerts "Please enter meeting mode!" and cancels the submit.
- If `Will_you_be_able_to_join_tomorrow == "No"` and `Not_attended_reason` is empty: alerts "Please enter meetiong not attended reson!" (sic) and cancels the submit.

---

### 4. `Meeting joining attendance status blank`

- **Link name (file):** `Meeting_joining_attendanc`
- **Workflow name:** `Meeting joining attendance status blank`
- **Trigger / Event:** Created or Edited — validations on form submission
- **GitHub:** [Meeting_joining_attendanc.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Meeting_joining_attendanc.js)

**What it does**

Requires the analyst to provide an attendance status before the record can be saved.

- If `Will_you_be_able_to_join_tomorrow` is empty: alerts "Please Upadte your meeting satus Will_you_be_able_to_join_tomorrow?." (sic) and cancels the submit.

---

### 5. `Not able to create record directedly from the form`

- **Link name (file):** `Not_able_to_create_record`
- **Workflow name:** `Not able to create record directedly from the form`
- **Trigger / Event:** Created — on load of the form
- **GitHub:** [Not_able_to_create_record.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Not_able_to_create_record.js)

**What it does**

Prevents any user other than the system account from directly creating a new attendance record from the form.

- Condition: runs when the logged-in user is **not** `zoho@enamamc.com`.
- Actions: disables the fields `Mode`, `Not_attended_reason`, `Location`, `Will_you_be_able_to_join_tomorrow`, `Analyst_Name`, and `Meeting_Detail`, then alerts "You do not have access to create record!".

---

### 6. `Not editable meeting details and Analyst`

- **Link name (file):** `Not_editable_meeting_deta`
- **Workflow name:** `Not editable meeting details and Analyst`
- **Trigger / Event:** Created or Edited — on load of the form
- **GitHub:** [Not_editable_meeting_deta.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Not_editable_meeting_deta.js)

**What it does**

Locks the meeting linkage and analyst identity for everyone except the system account, on both create and edit.

- Condition: runs when the logged-in user is **not** `zoho@enamamc.com`.
- Actions: disables the `Meeting_Detail` and `Analyst_Name` fields so a regular user cannot change which meeting/analyst the record belongs to.

---

### 7. `Redirect to the meeting page`

- **Link name (file):** `Redirect_to_the_meeting_p`
- **Workflow name:** `Redirect to the meeting page`
- **Trigger / Event:** Created or Edited — on successful form submission
- **GitHub:** [Redirect_to_the_meeting_p.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Redirect_to_the_meeting_p.js)

**What it does**

After a successful save, sends the user to the attendance report entry for their analyst.

- Looks up the `Morning_Meeting_Attendance` record where `Analyst_Name == input.Analyst_Name`.
- Opens the report `All_Morning_Meeting_Attendances` filtered to that record's ID (`openUrl(..., "same window")`).
- The file also contains commented-out code (an alternate flow referencing `Meeting_Notes_Edit_Request`, research-head email, company name, and a meeting-note edit report link) that is not active.

---

### 8. `data populate in meeting details subfrom`

- **Link name (file):** `data_populate_in_meeting_`
- **Workflow name:** `data populate in meeting details subfrom`
- **Trigger / Event:** Created or Edited — on successful form submission
- **GitHub:** [data_populate_in_meeting_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/data_populate_in_meeting_.js)

**What it does**

Mirrors this attendance record's values back into the parent Meeting Details record's `Analyst_Meeting_Attendance` sub-form row for the same analyst.

- Fetches the `Meeting_Details` record where `ID == input.Meeting_Detail` (and logs it via `info`).
- Loops through each row of that meeting's `Analyst_Meeting_Attendance` sub-form.
- When it finds the row whose `Analyst_Name.ID` matches `input.Analyst_Name.ID`, it updates that row with:
  - `Analyst_Name` = submitted `Analyst_Name`
  - `Invited` = submitted `Meeting_Invite_Response_Status`
  - `Will_you_be_able_to_join_tomorrow_s_meeting` = submitted `Will_you_be_able_to_join_tomorrow`
  - `Mode` = submitted `Mode`
- Saves the row (`row.update(...)`), logs a confirmation, and breaks out of the loop.

---

## Field Rule Workflows (no-code configuration)

These workflows are built with Zoho Creator's built-in **Field rules** (no Deluge script). Their actions execute on form load and whenever a field participating in a condition is changed by the user. The linked screenshots capture the exact configuration.

### 9. `Hide Developer Section`

- **Link name (file):** `Hide_Developer_Section` (screenshot)
- **Workflow name:** `Hide Developer Section`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Hide_Developer_Section.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/Hide_Developer_Section.png)

**What it does**

Runs unconditionally ("Execute without condition") and hides the **Developer_Section** field so it never appears on the form.

---

### 10. `show and hide fields`

- **Link name (file):** `show_and_hide_fields` (screenshot)
- **Workflow name:** `show and hide fields`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [show_and_hide_fields.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Attendance/show_and_hide_fields.png)

**What it does**

Shows/hides fields conditionally based on the analyst's answer to **Will_you_be_able_to_join_tomorrow**:

- **== "Yes":** show **Mode**, hide **Not_attended_reason**.
- **== "No":** show **Not_attended_reason**, hide **Mode** and **Location**.
- **== "Not Responded":** hide **Mode** and **Not_attended_reason**.
