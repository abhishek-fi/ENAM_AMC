# Form Workflows — Morning Meeting Notes Master

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Morning Meeting Notes Master

This form captures the notes for a morning meeting. It has a single form workflow that runs after a new notes record is successfully created: it calls a shared function to build/refresh the "Not Applied" attendance list for the meeting referenced on the record. There are no reference screenshots in this folder.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `FI_AB_Add_attendance_list` | FI_AB Add attendance list | On successful form submission (record Created) | [FI_AB_Add_attendance_list.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes_Master/FI_AB_Add_attendance_list.js) |

## Workflow Details

### 1. `FI_AB_Add_attendance_list`

- **Workflow name:** `FI_AB Add attendance list`
- **Trigger / Event:** On successful form submission — runs after a Morning Meeting Notes Master record is Created
- **GitHub:** [FI_AB_Add_attendance_list.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Meeting_Notes_Master/FI_AB_Add_attendance_list.js)

**What it does**

When a new meeting-notes record is created and submitted successfully, this workflow hands off to the application-level function `FI_AB_Update_Not_Applied_List`, passing the meeting reference from the newly created record.

- Reads the `Meeting_Detail` field from the record just submitted (`input.Meeting_Detail`), which links the notes to a specific morning meeting.
- Calls `thisapp.FI_AB_Update_Not_Applied_List(input.Meeting_Detail)` to update/refresh the "Not Applied" attendance list for that meeting.
- All the actual attendance-list logic lives in the shared function; this workflow only acts as the trigger that fires it after a notes record is added.
