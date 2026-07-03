# Form Workflows — Meeting Details

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Meeting Details

The **Meeting Details** form captures the morning meeting record — meeting title, date, and an **Analyst Meeting Attendance** subform tracking each analyst's invitation, attendance, mode, reasons for non-attendance, and availability for the next day's meeting. Its workflows make the form effectively read-only. Two are Deluge "on load of the form" access-control rules — one blocks record creation entirely (with an alert), and the other disables the header fields and every column of the attendance subform. A third is a no-code **Field rule** (configured via Zoho Creator) that hides the add/delete controls on the attendance subform so no rows can be inserted or removed through this form.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Form_View_Only_No_One_can` | Form View Only No One can | Created — Load of the form | [Form_View_Only_No_One_can.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Form_View_Only_No_One_can.js) |
| 2 | `meeting_details_read_only` | meeting details read only | Created or Edited — Load of the form | [meeting_details_read_only.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/meeting_details_read_only.js) |
| 3 | `Analyst_subform_not_edita` (screenshot) | Analyst subform not editable | Created or Edited · Field rule (form load & field input) | [Analyst_subform_not_edita.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Analyst_subform_not_edita.png) |

## Workflow Details

### 1. `Form View Only No One can`

- **Link name (file):** `Form_View_Only_No_One_can`
- **Workflow name:** `Form View Only No One can`
- **Trigger / Event:** Created — Load of the form
- **GitHub:** [Form_View_Only_No_One_can.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Form_View_Only_No_One_can.js)

**What it does**

Runs when the form is opened in **create (new record)** mode and effectively blocks record creation:

- Disables the **Meeting_Date** field.
- Disables the **Meeting_Title** field.
- Shows an alert: `"You do not have access to create record!"`.

The alert on load signals that users are not permitted to create a Meeting Details record from this form.

---

### 2. `meeting details read only`

- **Link name (file):** `meeting_details_read_only`
- **Workflow name:** `meeting details read only`
- **Trigger / Event:** Created or Edited — Load of the form
- **GitHub:** [meeting_details_read_only.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/meeting_details_read_only.js)

**What it does**

Runs whenever the form is opened in either **create** or **edit** mode and makes the entire form read-only by disabling the header fields and every column of the **Analyst_Meeting_Attendance** subform:

- Disables **Meeting_Title**.
- Disables **Meeting_Date**.
- Disables the following subform columns of **Analyst_Meeting_Attendance**:
  - **Analyst_Name**
  - **Invited**
  - **Attended_Mode**
  - **Have_you_attended_today_s_meeting**
  - **Not_Attended_Reason**
  - **Mode**
  - **Will_you_be_able_to_join_tomorrow_s_meeting**

No fields are populated, no records or emails are created, and no submit validation/cancel is performed — the workflow purely locks the fields so the meeting attendance data can be viewed but not modified through this form.

---

## Field Rule Workflows (no-code configuration)

These workflows are built with Zoho Creator's built-in **Field rules** (no Deluge script). Their actions execute on form load and whenever a field participating in a condition is changed by the user. The linked screenshot captures the exact configuration.

### 3. `Analyst subform not editable`

- **Link name (file):** `Analyst_subform_not_edita` (screenshot)
- **Workflow name:** `Analyst subform not editable`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Analyst_subform_not_edita.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Analyst_subform_not_edita.png)

**What it does**

Runs unconditionally ("Execute without condition") and locks the **Analyst_Meeting_Attendance** subform so its rows cannot be added or removed on this form:

- **Hide subform delete entry** for `Analyst_Meeting_Attendance` — users cannot delete existing rows.
- **Hide subform add entry** for `Analyst_Meeting_Attendance` — users cannot add new rows.

Together with the `meeting details read only` script workflow (which disables every field), this makes the attendance subform fully view-only.
