# Form Workflows — Meeting Details

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Meeting Details

The **Meeting Details** form captures the morning meeting record — meeting title, date, and an **Analyst Meeting Attendance** subform tracking each analyst's invitation, attendance, mode, reasons for non-attendance, and availability for the next day's meeting. Its two workflows are both "on load of the form" access-control rules that make the form effectively read-only. One blocks record creation entirely (with an alert), and the other disables the header fields and every column of the attendance subform so no one can edit the data through this form.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Form_View_Only_No_One_can` | Form View Only No One can | Created — Load of the form | [Form_View_Only_No_One_can.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Form_View_Only_No_One_can.js) |
| 2 | `meeting_details_read_only` | meeting details read only | Created or Edited — Load of the form | [meeting_details_read_only.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/meeting_details_read_only.js) |

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

## Reference Screenshots

- [Analyst_subform_not_edita.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Details/Analyst_subform_not_edita.png) — Likely a screenshot of the form config showing the **Analyst Meeting Attendance** subform set to non-editable (read-only), corresponding to the field-disabling workflow above.
