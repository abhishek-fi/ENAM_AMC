# Schedules — Morning Meeting Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Section:** Scheduled Workflows

This folder holds the scheduled workflows (Zoho Creator "Schedules") that automate the daily Morning Meeting lifecycle: creating the meeting record, requesting attendance, sending meeting-notes reminders, generating the record-template / attendee content, exporting the final notes PDF to WorkDrive, and doing housekeeping such as revoking edit access, removing files, and adding no-shows to the "Not Attended" list. Most schedules include a production guard — `if(zoho.appuri.contains("environment")) return;` — so they run **only in the live (production) app** and are skipped in the dev/`environment` copy. Several are currently **disabled per client request** (indicated by a second comment line in the file); a few files are not time-based schedules at all but field/form-triggered workflows saved alongside the schedules (their first-line comment describes a "Based on … Time" trigger rather than a fixed date/time). Weekday-only schedules additionally skip Saturdays and Sundays via `getDayOfWeek()` checks.

## Summary

| # | Link name (file) | Schedule name | Frequency / Time | Status | Calls | GitHub |
|---|------------------|---------------|------------------|--------|-------|--------|
| 1 | `FI_AB_Add_to_Not_Attended` | FI_AB Add to Not Attended List in Master | Triggered on record Added Time (not date-scheduled) | Active | (inline — updates `Morning_Meeting_Notes_Master`) | [FI_AB_Add_to_Not_Attended.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Add_to_Not_Attended.js) |
| 2 | `FI_AB_Delete_Completed_Me` | FI_AB Delete Completed Meeting Drafts | 10-Dec-2025 · 11:31:00 (one-time) | Disabled | (none — body fully commented out) | [FI_AB_Delete_Completed_Me.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Delete_Completed_Me.js) |
| 3 | `First_Meting_Notes_Remain` | First Meting Notes Remainder | 05-Aug-2025 · 11:00:00 · Daily | Disabled | `send_meeting_Notes_Second_reminder()` | [First_Meting_Notes_Remain.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/First_Meting_Notes_Remain.js) |
| 4 | `FI_AB_Disable_edit_access` | FI_AB Disable edit access flag | 07-Jan-2026 · 11:30:00 · Daily | Active | (inline — clears `Edit_Access` on stored notes) | [FI_AB_Disable_edit_access.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Disable_edit_access.js) |
| 5 | `FI_AB_Generate_PDF_to_Wor` | FI_AB Generate PDF to Workdrive | 26-Dec-2025 · 11:30:30 · Daily (weekdays) | Active | `FI_AB_Send_Email_To_Research_Team(fileUrl)` + WorkDrive upload | [FI_AB_Generate_PDF_to_Wor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Generate_PDF_to_Wor.js) |
| 6 | `FI_AB_Generate_Record_Tem` | FI_AB Generate Record Template Content | 11-Dec-2025 · 11:30:00 · Daily (weekdays) | Active | `FI_AB_Update_Not_Applied_List`, `FI_AB_Create_Absentees_Record`, `FI_AB_Update_Not_Attended_List` | [FI_AB_Generate_Record_Tem.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Generate_Record_Tem.js) |
| 7 | `FI_AB_Remove_Files` | FI_AB Remove Files | Triggered on record Remove Time (not date-scheduled) | Active | (inline — prunes `Additional_Attachment`) | [FI_AB_Remove_Files.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Remove_Files.js) |
| 8 | `FI_AB_Revoke_edit_access_` | FI_AB Revoke edit access after 24 hours | Triggered on Edit Access Date/Time + 24h (not date-scheduled) | Active | (inline — sets `Edit_Access = false`) | [FI_AB_Revoke_edit_access_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Revoke_edit_access_.js) |
| 9 | `Only_one_post_meeting_rem` | Only_one_post_meeting_reminder_FI_AB | 27-May-2026 · 09:30:00 · Daily (weekdays) | Active | `Post_Meeting_Attendance_Request_FI_AB(meetingId)` | [Only_one_post_meeting_rem.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Only_one_post_meeting_rem.js) |
| 10 | `Only_one_pre_meeting_remi1` | Only_one_pre_meeting_reminder_FI_AB | 13-May-2026 · 09:15:00 · Daily (weekdays) | Disabled | `Pre_meeting_attendance_and_meeting_reminder(meetingId)` | [Only_one_pre_meeting_remi1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Only_one_pre_meeting_remi1.js) |
| 11 | `Remainder1` | Remainder1 | 31-Jul-2025 · 17:00:00 · Daily | Disabled | `send_meeting_attendance_reminders()` | [Remainder1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder1.js) |
| 12 | `Remainder2` | Remainder2 | 31-Jul-2025 · 09:00:00 · Daily | Disabled | `getsecondremainder()` | [Remainder2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder2.js) |
| 13 | `Remainder3` | Remainder3 | 31-Jul-2025 · 09:15:00 · Daily | Disabled | `getthirdremainder()` | [Remainder3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder3.js) |
| 14 | `daily_meeting` | daily meeting | 30-Jul-2025 · 11:30:00 · Daily | Active | `create_meeting_with_attendance()` | [daily_meeting.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/daily_meeting.js) |
| 15 | `daily_Meeting_notes_` | daily Meeting notes | 05-Aug-2025 · 10:30:00 · Daily | Disabled | `send_meeting_notes_request_email()` | [daily_Meeting_notes_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/daily_Meeting_notes_.js) |
| 16 | `Second_Meeting_Notes_Rema` | Second Meeting Notes Remainder | 05-Aug-2025 · 11:15:00 · Daily | Disabled | `thirdMeetingNotesremainder()` | [Second_Meeting_Notes_Rema.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Second_Meeting_Notes_Rema.js) |
| 17 | `send_first_meeting_notifi` | send first meeting notification for tomorrow | 07-Jan-2026 · 15:00:00 · Daily (weekdays) | Disabled | `send_first_meeting_nofication(meetingId)` | [send_first_meeting_notifi.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/send_first_meeting_notifi.js) |

## Schedule Details

### 1. `FI_AB Add to Not Attended List in Master`

- **Link name (file):** `FI_AB_Add_to_Not_Attended`
- **Schedule name:** `FI_AB Add to Not Attended List in Master`
- **Runs:** Not a time-based schedule — triggered on record Added Time (first-line comment: "Morning Meeting Notes - Based on Added Time")
- **Status:** Active
- **GitHub:** [FI_AB_Add_to_Not_Attended.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Add_to_Not_Attended.js)

**What it does**

Despite living in the Schedules folder, this is a record-triggered workflow that fires when a Morning Meeting Notes record is added. When the attendee answers "No" to *Have you attended today's meeting?* and a meeting is set:

- It looks up the `Morning_Meeting_Notes_Master` record for that meeting; if none exists, it creates one (recording the current login user and the meeting).
- It reads the master's existing `Not_Attended_List`, appends the current record's ID, and saves the updated list back.

The effect is to accumulate a list of no-shows on the meeting's master record. There is no production guard here.

---

### 2. `FI_AB Delete Completed Meeting Drafts`

- **Link name (file):** `FI_AB_Delete_Completed_Me`
- **Schedule name:** `FI_AB Delete Completed Meeting Drafts`
- **Runs:** 10-Dec-2025 at 11:31:00 (one-time)
- **Status:** Disabled
- **GitHub:** [FI_AB_Delete_Completed_Me.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Delete_Completed_Me.js)

**What it does**

Disabled per client request, and the entire body is additionally commented out — so it does nothing as it stands. The commented logic *would have* found today's meetings and deleted every `Morning_Notes` record still in "Draft" status for those meetings (a cleanup of unsubmitted drafts).

---

### 3. `First Meting Notes Remainder`

- **Link name (file):** `First_Meting_Notes_Remain`
- **Schedule name:** `First Meting Notes Remainder`
- **Runs:** 05-Aug-2025 at 11:00:00, Daily
- **Status:** Disabled
- **GitHub:** [First_Meting_Notes_Remain.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/First_Meting_Notes_Remain.js)

**What it does**

Disabled per client request. When active it runs only in production (returns early if `zoho.appuri` contains "environment"), then calls `thisapp.send_meeting_Notes_Second_reminder()` to send a reminder prompting analysts to submit their meeting notes.

---

### 4. `FI_AB Disable edit access flag`

- **Link name (file):** `FI_AB_Disable_edit_access`
- **Schedule name:** `FI_AB Disable edit access flag`
- **Runs:** 07-Jan-2026 at 11:30:00, Daily
- **Status:** Active
- **GitHub:** [FI_AB_Disable_edit_access.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Disable_edit_access.js)

**What it does**

Runs daily with no production guard. It finds today's meeting, gathers all `Morning_Notes` for that meeting whose `Record_Status1` is "Stored", and sets each note's `Edit_Access` flag to `false`. The effect is to lock stored notes from further editing once the meeting-notes window closes.

---

### 5. `FI_AB Generate PDF to Workdrive`

- **Link name (file):** `FI_AB_Generate_PDF_to_Wor`
- **Schedule name:** `FI_AB Generate PDF to Workdrive`
- **Runs:** 26-Dec-2025 at 11:30:30, Daily (skips weekends)
- **Status:** Active
- **GitHub:** [FI_AB_Generate_PDF_to_Wor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Generate_PDF_to_Wor.js)

**What it does**

Runs only in production (returns if `zoho.appuri` contains "environment") and skips Saturday/Sunday. For today's meeting it:

- Builds a file name like `13 January 2026 Morning Meeting.pdf` and fetches the rendered record PDF from the `Morning_Meeting_Notes_Master_Report_Templates` report via an `invokeurl` GET (using a Creator perma/record-pdf link).
- Emails the PDF link to the research team by calling `thisapp.FI_AB_Send_Email_To_Research_Team(fileUrl)`.
- Ensures a WorkDrive folder exists for the meeting (reads `Workdrive_Folder_ID` from the master record, creating a folder under the fixed parent folder via `zoho.workdrive.createFolder` if empty), then uploads the PDF with `zoho.workdrive.uploadFile` and stores the returned `resource_id` back on the meeting (`File_Resource_Id`).

The effect is the automated daily distribution and archival of the finalized morning-meeting notes PDF. A commented-out test `sendmail` block is left at the end.

---

### 6. `FI_AB Generate Record Template Content`

- **Link name (file):** `FI_AB_Generate_Record_Tem`
- **Schedule name:** `FI_AB Generate Record Template Content`
- **Runs:** 11-Dec-2025 at 11:30:00, Daily (skips weekends)
- **Status:** Active
- **GitHub:** [FI_AB_Generate_Record_Tem.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Generate_Record_Tem.js)

**What it does**

The heavyweight content-builder for the daily notes template; it has no production guard but skips weekends. For today's meeting it first calls three app functions (each wrapped in try/catch): `FI_AB_Update_Not_Applied_List`, `FI_AB_Create_Absentees_Record`, and `FI_AB_Update_Not_Attended_List`. It then assembles the rich-text fields on the meeting's `Morning_Meeting_Notes_Master` record:

- **Updates (`Updates_RT`):** pulls `Morning_Notes` submitted in the last business day with status "Stored", groups them by analyst, and renders a single HTML table. Notes are emitted one `<tr>` per note (with detailed comments explaining this avoids the PDF renderer pushing a whole analyst block to the next page), applying a style-preserving sanitizer that merges page-break-safe defaults into pasted table/td/th/p/div/span/img markup. Topic headers combine company or sector name with the topic. Falls back to "No significant development to update." when empty, and wraps everything in a PT Serif / Liberation Serif font block.
- **Meeting date/location (`Meeting_Date_RT`, `Meeting_Location_RT`):** formats the meeting date as e.g. "January 13, 2026 - 09:30 AM to 10:00 AM" and hard-codes location "Mumbai (Large Conferance Room)".
- **Attendees (`Attendees_RT`):** collects analysts who marked attendance "Yes", orders them (Jiten first, then Fund Manager, Analyst Admin, Analyst, others), marks analysts with no notes with a `*`, and lays them into a two-column HTML table (first 8 names left, rest right).
- **Participants (`Participants_RT`):** lists all active users in a fixed lead order (Jiten Doshi, Raghavendra Reddy, Kuldeep Gangwar) followed by the rest sorted alphabetically, flagging analysts/analyst-admins who did not attend with `*`, again split into a two-column table.

The effect is to populate the master record with print-ready HTML used by the PDF template that schedule #5 later exports.

---

### 7. `FI_AB Remove Files`

- **Link name (file):** `FI_AB_Remove_Files`
- **Schedule name:** `FI_AB Remove Files`
- **Runs:** Not a time-based schedule — triggered on record Remove Time (first-line comment: "Morning Notes - Based on Remove Time")
- **Status:** Active
- **GitHub:** [FI_AB_Remove_Files.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Remove_Files.js)

**What it does**

A record-triggered cleanup (not date-scheduled, no production guard). For every `Morning_Notes` record in "Draft" status that has a non-empty `Removed_List`, it rebuilds `Additional_Attachment` to contain only the attachments not present in `Removed_List` — effectively deleting the files the user marked for removal from draft notes. Uses several `info` debug statements.

---

### 8. `FI_AB Revoke edit access after 24 hours`

- **Link name (file):** `FI_AB_Revoke_edit_access_`
- **Schedule name:** `FI_AB Revoke edit access after 24 hours`
- **Runs:** Not a time-based schedule — triggered on Edit Access Date/Time + 24 hours (first-line comment: "Morning Notes - Based on Edit Access Date Time: after 24 hours")
- **Status:** Active
- **GitHub:** [FI_AB_Revoke_edit_access_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/FI_AB_Revoke_edit_access_.js)

**What it does**

A per-record time-based workflow that fires 24 hours after a note's edit-access timestamp. It sets `input.Edit_Access = false`, revoking the record's edit access once the 24-hour grace window has elapsed. One-line body, no production guard.

---

### 9. `Only_one_post_meeting_reminder_FI_AB`

- **Link name (file):** `Only_one_post_meeting_rem`
- **Schedule name:** `Only_one_post_meeting_reminder_FI_AB`
- **Runs:** 27-May-2026 at 09:30:00, Daily (skips weekends)
- **Status:** Active
- **GitHub:** [Only_one_post_meeting_rem.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Only_one_post_meeting_rem.js)

**What it does**

Runs each weekday (no production guard; skips Sat/Sun). It looks up today's meeting and, if one exists, calls `thisapp.Post_Meeting_Attendance_Request_FI_AB(meetingId)` — the single post-meeting attendance request/reminder. Includes `info` debug output of the meeting title and ID.

---

### 10. `Only_one_pre_meeting_reminder_FI_AB`

- **Link name (file):** `Only_one_pre_meeting_remi1`
- **Schedule name:** `Only_one_pre_meeting_reminder_FI_AB`
- **Runs:** 13-May-2026 at 09:15:00, Daily (skips weekends)
- **Status:** Disabled
- **GitHub:** [Only_one_pre_meeting_remi1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Only_one_pre_meeting_remi1.js)

**What it does**

Disabled per client request. When active it skips weekends, looks up today's meeting, and (if one exists) calls `thisapp.Pre_meeting_attendance_and_meeting_reminder(meetingId)` — the single pre-meeting attendance and meeting reminder. No production guard in the body (the disable is via the comment).

---

### 11. `Remainder1`

- **Schedule name:** `Remainder1`
- **Runs:** 31-Jul-2025 at 17:00:00, Daily
- **Status:** Disabled
- **GitHub:** [Remainder1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder1.js)

**What it does**

Disabled per client request. When active it runs only in production (returns if `zoho.appuri` contains "environment") and calls `thisapp.send_meeting_attendance_reminders()` — an evening (17:00) attendance reminder.

---

### 12. `Remainder2`

- **Schedule name:** `Remainder2`
- **Runs:** 31-Jul-2025 at 09:00:00, Daily
- **Status:** Disabled
- **GitHub:** [Remainder2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder2.js)

**What it does**

Disabled per client request. Production-only guard, then calls `thisapp.getsecondremainder()` — the 09:00 second reminder.

---

### 13. `Remainder3`

- **Schedule name:** `Remainder3`
- **Runs:** 31-Jul-2025 at 09:15:00, Daily
- **Status:** Disabled
- **GitHub:** [Remainder3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Remainder3.js)

**What it does**

Disabled per client request. Production-only guard, then calls `thisapp.getthirdremainder()` — the 09:15 third reminder.

---

### 14. `daily meeting`

- **Link name (file):** `daily_meeting`
- **Schedule name:** `daily meeting`
- **Runs:** 30-Jul-2025 at 11:30:00, Daily
- **Status:** Active
- **GitHub:** [daily_meeting.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/daily_meeting.js)

**What it does**

Runs daily with no production guard. It simply calls `thisapp.create_meeting_with_attendance()` to create the day's meeting record together with its attendance rows. A commented-out block shows an earlier "create for tomorrow, only on weekend" variant that is no longer used — the live code always creates the meeting.

---

### 15. `daily Meeting notes`

- **Link name (file):** `daily_Meeting_notes_`
- **Schedule name:** `daily Meeting notes`
- **Runs:** 05-Aug-2025 at 10:30:00, Daily
- **Status:** Disabled
- **GitHub:** [daily_Meeting_notes_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/daily_Meeting_notes_.js)

**What it does**

Disabled per client request. Production-only guard, then calls `thisapp.send_meeting_notes_request_email()` — the email asking analysts to submit their meeting notes.

---

### 16. `Second Meeting Notes Remainder`

- **Link name (file):** `Second_Meeting_Notes_Rema`
- **Schedule name:** `Second Meeting Notes Remainder`
- **Runs:** 05-Aug-2025 at 11:15:00, Daily
- **Status:** Disabled
- **GitHub:** [Second_Meeting_Notes_Rema.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/Second_Meeting_Notes_Rema.js)

**What it does**

Disabled per client request. Production-only guard, then calls `thisapp.thirdMeetingNotesremainder()` — a follow-up meeting-notes reminder.

---

### 17. `send first meeting notification for tomorrow`

- **Link name (file):** `send_first_meeting_notifi`
- **Schedule name:** `send first meeting notification for tomorrow`
- **Runs:** 07-Jan-2026 at 15:00:00, Daily (skips when tomorrow is a weekend)
- **Status:** Disabled
- **GitHub:** [send_first_meeting_notifi.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Schedules/send_first_meeting_notifi.js)

**What it does**

Disabled per client request. When active it runs only in production (returns if `zoho.appuri` contains "environment"), computes tomorrow's date, and skips if tomorrow is Saturday/Sunday. Otherwise it looks up tomorrow's meeting ID and calls `thisapp.send_first_meeting_nofication(meetingD)` to send the advance notification for the next day's meeting.

---
