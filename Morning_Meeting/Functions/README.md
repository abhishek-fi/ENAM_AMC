# Functions — Morning Meeting Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Section:** Standalone Functions

This section holds the standalone Deluge functions that automate the daily Analyst "Morning Meeting" lifecycle. Together they: create the next meeting and pre-populate the invitee/attendance list, send a graded sequence of pre-meeting attendance reminders (first intimation → reminder 1 → 2 → 3), collect the analysts' attendance responses via one-click email buttons, request and chase post-meeting attendance and meeting notes, roll up "Not Applied" and "Not Attended" lists into a per-meeting master record for the PDF report, and finally email the compiled morning-meeting note (PDF attachment) to the research team. Most functions read/write two central forms — `Meeting_Details` (with its `Analyst_Meeting_Attendance` subform), `Morning_Meeting_Attendance`, and `Morning_Meeting_Notes` (plus `Morning_Meeting_Notes_Master` and `Morning_Notes`) — and send email from `rms@enamamc.com`. Attendance-marking emails point at hosted "page-perma" public pages that call back into `FI_AB_Update_Attendance`.

## Summary

| # | Link name (file) | Function name | Signature | Purpose |
|---|------------------|---------------|-----------|---------|
| 1 | FI_AB_Attenedance_Email | FI_AB_Attenedance_Email | `string FI_AB_Attenedance_Email(int recID)` | Email a single analyst the three attendance-response buttons for one attendance record. |
| 2 | FI_AB_Create_Absentees_Record | FI_AB_Create_Absentees_Record | `void FI_AB_Create_Absentees_Record(int meetingId)` | Create/update `Morning_Meeting_Notes` "No" records for people who confirmed but did not add notes, and for those who declined. |
| 3 | FI_AB_Get_Current_FY | FI_AB_Get_Current_FY | `string FI_AB_Get_Current_FY()` | Return the previous quarter/FY label (e.g. `Q1FY26`) used as the results-section header. |
| 4 | FI_AB_Send_Email_To_Research_Team | FI_AB_Send_Email_To_Research_Team | `void FI_AB_Send_Email_To_Research_Team(string pdfUrl)` | Compile today's stored notes into a categorized email and send it with the meeting-note PDF attached. |
| 5 | FI_AB_Update_Attendance | FI_AB_Update_Attendance | `string FI_AB_Update_Attendance(string recID, string mode, string doesJoin, string reasonNotAttend)` | Update one attendance record with the chosen mode / join decision (called from the email buttons). |
| 6 | FI_AB_Update_Not_Applied_List | FI_AB_Update_Not_Applied_List | `void FI_AB_Update_Not_Applied_List(int recId)` | Build the "Not Applied" list + HTML table on the notes master record. |
| 7 | FI_AB_Update_Not_Attended_List | FI_AB_Update_Not_Attended_List | `void FI_AB_Update_Not_Attended_List(int recId)` | Build the "Not Attended" list + HTML table on the notes master record. |
| 8 | create_meeting_with_attendance | create_meeting_with_attendance | `void create_meeting_with_attendance()` | Create the next working-day meeting with an attendance subform for all active analysts. |
| 9 | getsecondremainder | getsecondremainder | `void getsecondremainder()` | Send the 2nd pre-meeting attendance reminder to non-responders (sets `Reminder_2`). |
| 10 | getthirdremainder | getthirdremainder | `void getthirdremainder()` | Send the 3rd/urgent pre-meeting attendance reminder to non-responders (sets `Reminder_3`). |
| 11 | Post_Meeting_Attendance_Request_FI_AB | Post_Meeting_Attendance_Request_FI_AB | `void Post_Meeting_Attendance_Request_FI_AB(int meetingId)` | Seed post-meeting notes rows and email attendees the post-meeting attendance buttons. |
| 12 | Pre_meeting_attendance_and_meeting_reminder | Pre_meeting_attendance_and_meeting_reminder | `void Pre_meeting_attendance_and_meeting_reminder(int meetingId)` | Meeting-day reminder: chase non-responders and confirm those who said Yes. |
| 13 | send_first_meeting_nofication | send_first_meeting_nofication | `void send_first_meeting_nofication(int meetingD)` | Send the first attendance-confirmation intimation for a meeting. |
| 14 | send_meeting_attendance_reminders | send_meeting_attendance_reminders | `void send_meeting_attendance_reminders()` | Send the 1st pre-meeting attendance reminder for tomorrow's meeting (sets `Reminder_1`). |
| 15 | send_meeting_notes_request_email | send_meeting_notes_request_email | `void send_meeting_notes_request_email()` | First request for post-meeting notes/attendance, with a subject tailored to what's missing. |
| 16 | send_meeting_Notes_Second_reminder | send_meeting_Notes_Second_reminder | `void send_meeting_Notes_Second_reminder()` | Second notes/attendance reminder with dynamic status text. |
| 17 | thirdMeetingNotesremainder | thirdMeetingNotesremainder | `void thirdMeetingNotesremainder()` | Third/final notes/attendance reminder (sets `Reminder_6`). |

## Function Details

### 1. `FI_AB_Attenedance_Email`

- **Function name:** `FI_AB_Attenedance_Email`
- **Signature:** `string FI_AB_Attenedance_Email(int recID)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Attenedance_Email.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Attenedance_Email.js)

**What it does**

Sends one analyst an attendance-confirmation email containing three one-click buttons for a specific `Morning_Meeting_Attendance` record.

- Looks up the attendance record by `recID`, then its analyst in `User_Master` (only if `User_Status == "Active"`).
- Builds three links to the hosted public page `Morning_Meetings_Attendance_Update`, passing `recID` plus query params: **Attending In-person** (`doesJoin=true&mode=offline`), **Attend via Teams** (`doesJoin=true&mode=online`), and **Not attending** (`doesJoin=false&mode=none`). Those pages ultimately drive `FI_AB_Update_Attendance`.
- Sends the HTML email from `rms@enamamc.com` to the analyst's email with subject "Moning Meeting Attendance".
- Returns `"success"` if the active user was found and the mail sent, otherwise `"failed"`.

---

### 2. `FI_AB_Create_Absentees_Record`

- **Function name:** `FI_AB_Create_Absentees_Record`
- **Signature:** `void FI_AB_Create_Absentees_Record(int meetingId)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Create_Absentees_Record.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Create_Absentees_Record.js)

**What it does**

Ensures every invited analyst has a `Morning_Meeting_Notes` row for the meeting, defaulting non-participants to "did not attend".

- Reads the `Meeting_Details` record and the list of analysts who confirmed "Yes" in `Morning_Meeting_Attendance` for the meeting.
- Removes those who already have a notes record with an attendance answer (`Have_you_attended_today_s_meeting` = "Yes" or "No"), then inserts a `Morning_Meeting_Notes` row (`Have_you_attended_today_s_meeting = "No"`) for each remaining confirmed-but-unrecorded analyst.
- Then processes attendance records where the analyst answered "No": if no notes row exists it inserts one with the `Not_attended_reason`; if a row exists with a blank attendance answer it fills in the reason and marks it "No".
- Writes only to `Morning_Meeting_Notes`. Returns nothing. (A test `sendmail` block is commented out.)

---

### 3. `FI_AB_Get_Current_FY`

- **Function name:** `FI_AB_Get_Current_FY`
- **Signature:** `string FI_AB_Get_Current_FY()`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Get_Current_FY.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Get_Current_FY.js)

**What it does**

Utility that returns the **previous** quarter and financial-year label used as the "Results" section header in the research-team email.

- Uses the current date to derive the current quarter on an April–March Indian FY basis (Apr–Jun = Q1, etc.) and the current FY (FY rolls to `year+1` from April onward).
- Computes the previous quarter; if the current quarter is Q1 it rolls back to Q4 of the prior FY.
- Returns a string formatted `"Q" + prevQ + "FY" + <last two digits of FY>`, e.g. `Q1FY26`. Reads/writes no records.

---

### 4. `FI_AB_Send_Email_To_Research_Team`

- **Function name:** `FI_AB_Send_Email_To_Research_Team`
- **Signature:** `void FI_AB_Send_Email_To_Research_Team(string pdfUrl)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Send_Email_To_Research_Team.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Send_Email_To_Research_Team.js)

**What it does**

Compiles today's stored morning-meeting notes into a categorized HTML email and sends it, with the meeting-note PDF attached, to the research team.

- Fetches the PDF bytes from `pdfUrl` via `invokeurl` (GET), inside a try/catch.
- Reads `Morning_Notes` submitted within the last business day and with `Record_Status1 == "Stored"`.
- Calls `FI_AB_Get_Current_FY()` to build the "<FY> Results" section header.
- Loops the notes and buckets each into one of three HTML lists: **Results** (Event update = "Result Update", listing the `Company_Universe` company name), **New Ideas Update** (Business Update with `New_Ideas == "Yes"`, listing `Topic_Header`), or **Business Update** (other Business Updates, listing `Topic_Header`). Empty sections are omitted.
- Recipient depends on environment: if `zoho.appuri` contains "environment" (sandbox) it sends to the FristineTech test addresses; otherwise it sends to `wally.fernandes@enamamc.com`. Subject is "Morning Meeting Note – <date>".
- Sets the attachment filename to `"<dd MMMM yyyy> Morning Meeting.pdf"` and sends two emails from `rms@enamamc.com` — one to the resolved recipient and one to the FristineTech addresses — both with the PDF attached. Returns nothing.

---

### 5. `FI_AB_Update_Attendance`

- **Function name:** `FI_AB_Update_Attendance`
- **Signature:** `string FI_AB_Update_Attendance(string recID, string mode, string doesJoin, string reasonNotAttend)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Update_Attendance.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Update_Attendance.js)

**What it does**

Applies an analyst's attendance response to a `Morning_Meeting_Attendance` record. This is the back-end action behind the email/page buttons produced by the notification functions.

- Loads the record by `recID` (converted to long).
- If `mode == "offline"` sets `Mode = "Conference Room"` and `Will_you_be_able_to_join_tomorrow = "Yes"`; if `mode == "online"` sets `Mode = "MS Teams"` and join = "Yes"; otherwise sets join = "No" and stores `reasonNotAttend` in `Not_attended_reason`.
- Returns `"success"` when the record exists and was updated, otherwise `"failed"`. (`doesJoin` is a parameter but the branching keys off `mode`.)

---

### 6. `FI_AB_Update_Not_Applied_List`

- **Function name:** `FI_AB_Update_Not_Applied_List`
- **Signature:** `void FI_AB_Update_Not_Applied_List(int recId)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Update_Not_Applied_List.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Update_Not_Applied_List.js)

**What it does**

Builds/refreshes the "Not Applied List" (invitees who never responded to the pre-meeting attendance request) on the meeting's `Morning_Meeting_Notes_Master` record, both as a linked list and as a rendered HTML table for the report.

- Finds the `Morning_Meeting_Notes_Master` record for the meeting; if none exists it inserts one (this is also called at meeting-creation time to seed the master).
- Collects `Morning_Meeting_Attendance` IDs where the join answer is blank/"Not Responded", then removes those whose analysts already appear in `Morning_Meeting_Notes` (post-meeting recorded), leaving the true non-responders.
- Stores that list in `Not_Applied_List` and writes a formatted HTML table of analyst full names into `Not_Applied_List_RT`. Returns nothing.

---

### 7. `FI_AB_Update_Not_Attended_List`

- **Function name:** `FI_AB_Update_Not_Attended_List`
- **Signature:** `void FI_AB_Update_Not_Attended_List(int recId)`
- **Type:** Standalone function
- **GitHub:** [FI_AB_Update_Not_Attended_List.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/FI_AB_Update_Not_Attended_List.js)

**What it does**

Builds/refreshes the "Not Attended List" (people who marked they did not attend the meeting) on the meeting's `Morning_Meeting_Notes_Master` record.

- Reads `Morning_Meeting_Notes` rows for the meeting where `Have_you_attended_today_s_meeting == "No"`.
- Stores their IDs in the master's `Not_Attended_List` field, and writes an HTML table (analyst full name + `Not_attended_reason`) into `Not_Attended_List_RT`. Returns nothing.

---

### 8. `create_meeting_with_attendance`

- **Function name:** `create_meeting_with_attendance`
- **Signature:** `void create_meeting_with_attendance()`
- **Type:** Standalone function
- **GitHub:** [create_meeting_with_attendance.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/create_meeting_with_attendance.js)

**What it does**

Creates the next Analyst Meeting and pre-populates its attendance list. Intended to run on a schedule.

- Starting from today, scans forward up to 10 days to find the next non-weekend day (`getDayOfWeek` 1/7 = weekend); if none in range it returns.
- Checks the most recent `Meeting_Details` record; if a meeting already exists for that target date it aborts ("Already created").
- Loads active `User_Master` users, and for each with profile "Analyst" or "Analyst Admin" builds an `Analyst_Meeting_Attendance` subform row (Invited = true, blank join response).
- Inserts a `Meeting_Details` record titled "Analyst Meeting - <dd-MMM-yyyy>" with `Meeting_Date` set to the target day minus 2 hours and the subform rows attached.
- For each subform row, inserts a matching `Morning_Meeting_Attendance` record.
- Finally calls `FI_AB_Update_Not_Applied_List(meeting)` to create the master record with an initial not-applied list. Returns nothing.

---

### 9. `getsecondremainder`

- **Function name:** `getsecondremainder`
- **Signature:** `void getsecondremainder()`
- **Type:** Standalone function
- **GitHub:** [getsecondremainder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/getsecondremainder.js)

**What it does**

Sends the **second** pre-meeting attendance follow-up to analysts who still haven't responded.

- Uses today's date as the meeting date; skips weekends. Finds `Meeting_Details` with `Meeting_Date == today`.
- For each `Morning_Meeting_Attendance` row with a blank/"Not Responded" join answer, and whose analyst is active, has an email, and is not a Fund Manager, it emails the three attendance buttons (subject "Follow-Up Reminder: Meeting Attendance Still Not Marked", deadline 9:30 AM) from `rms@enamamc.com`.
- Marks `Reminder_2 = true` on the attendance record. Returns nothing.

---

### 10. `getthirdremainder`

- **Function name:** `getthirdremainder`
- **Signature:** `void getthirdremainder()`
- **Type:** Standalone function
- **GitHub:** [getthirdremainder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/getthirdremainder.js)

**What it does**

Sends the **third / urgent** pre-meeting attendance follow-up. Nearly identical to `getsecondremainder`.

- Today's date, skip weekends, find `Meeting_Details` for today.
- For each non-responding attendance row (blank / "Not respond") whose analyst is active, has email, and is not a Fund Manager, emails the three attendance buttons with a stronger subject "Action Required: Meeting Attendance Not Recorded".
- Marks `Reminder_3 = true` on the attendance record. Returns nothing.

---

### 11. `Post_Meeting_Attendance_Request_FI_AB`

- **Function name:** `Post_Meeting_Attendance_Request_FI_AB`
- **Signature:** `void Post_Meeting_Attendance_Request_FI_AB(int meetingId)`
- **Type:** Standalone function
- **GitHub:** [Post_Meeting_Attendance_Request_FI_AB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/Post_Meeting_Attendance_Request_FI_AB.js)

**What it does**

After the meeting, seeds post-meeting notes rows for all invitees and emails those without a recorded attendance answer a set of post-meeting attendance buttons.

- For every `Morning_Meeting_Attendance` record of the meeting, ensures a `Morning_Meeting_Notes` row exists for that analyst (inserts one if missing).
- Then, for each notes row where `Have_you_attended_today_s_meeting` is blank/null, and whose analyst is active, has email, and is not Fund Manager or Head of Research, it builds links to the hosted `Post_Meeting_Attendance_Update` page (Conference Room / MS Teams Call / Not Attended) and emails them (subject "Morning Meeting Attendance Request – <date>", action before 11:15 AM) from `rms@enamamc.com`. Returns nothing.

> Note: the subject uses `today` which is not defined locally in this function.

---

### 12. `Pre_meeting_attendance_and_meeting_reminder`

- **Function name:** `Pre_meeting_attendance_and_meeting_reminder`
- **Signature:** `void Pre_meeting_attendance_and_meeting_reminder(int meetingId)`
- **Type:** Standalone function
- **GitHub:** [Pre_meeting_attendance_and_meeting_reminder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/Pre_meeting_attendance_and_meeting_reminder.js)

**What it does**

Meeting-day reminder that handles both non-responders and confirmed attendees for a given meeting.

- Iterates `Morning_Meeting_Attendance` for the meeting.
- **Blank/no response** (active analyst, has email, not Fund Manager / Head of Research): emails the three attendance buttons with subject "Morning Meeting Reminder – <date>", asking for a response before 9:30 AM.
- **Answered "Yes"** (not Fund Manager / Head of Research): emails a confirmation reminder "Reminder : Morning Meeting Today – <date>" (no buttons) telling them to join on time.
- Sets `Reminder_3 = true` on the record in both branches. Returns nothing.

> Note: uses `today` which is not defined locally in this function.

---

### 13. `send_first_meeting_nofication`

- **Function name:** `send_first_meeting_nofication`
- **Signature:** `void send_first_meeting_nofication(int meetingD)`
- **Type:** Standalone function
- **GitHub:** [send_first_meeting_nofication.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/send_first_meeting_nofication.js)

**What it does**

Sends the **first** intimation asking analysts to confirm attendance for tomorrow's meeting.

- For each `Morning_Meeting_Attendance` row of the given meeting with a blank/"Not Responded" join answer, and whose analyst is active, has email, and is not a Fund Manager, emails the three attendance buttons with subject "First Intimation – Request for Tomorrow's Meeting Attendance Confirmation (...)".
- Sets `Meeting_Invite_Response_Status = true` on the attendance record (this flag is set for every processed row, not just those emailed). Returns nothing.

> Note: uses `tomorrow` which is not defined locally in this function.

---

### 14. `send_meeting_attendance_reminders`

- **Function name:** `send_meeting_attendance_reminders`
- **Signature:** `void send_meeting_attendance_reminders()`
- **Type:** Standalone function
- **GitHub:** [send_meeting_attendance_reminders.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/send_meeting_attendance_reminders.js)

**What it does**

Sends the **first** attendance reminder for tomorrow's meeting. Designed to run on a schedule (no parameters).

- Computes tomorrow's date and skips weekends. Finds `Meeting_Details` with `Meeting_Date == tomorrow`.
- For each non-responding `Morning_Meeting_Attendance` row (blank/"Not Responded") whose analyst is active, has email, and is not a Fund Manager, emails the three attendance buttons (subject "Reminder: Meeting Attendance Pending", deadline 9:30 AM).
- Sets `Reminder_1 = true` on the attendance record. Returns nothing.

---

### 15. `send_meeting_notes_request_email`

- **Function name:** `send_meeting_notes_request_email`
- **Signature:** `void send_meeting_notes_request_email()`
- **Type:** Standalone function
- **GitHub:** [send_meeting_notes_request_email.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/send_meeting_notes_request_email.js)

**What it does**

First request to analysts to add their post-meeting **notes and/or attendance** for today's meeting, with the email subject tailored to what is still missing.

- Runs for today's meeting; skips weekends. Iterates `Morning_Meeting_Attendance` for the meeting.
- For each analyst (profile check for "Analyst"/"Analyst Admin"), inspects existing `Morning_Meeting_Notes` rows to determine whether attendance is recorded and whether any `Morning_Notes` exist.
- Skips analysts who have both notes and attendance; otherwise chooses one of three subjects/messages: add attendance only, add notes only, or add both — each with a link to the `Meeting_Notes` page carrying `meetingId`.
- Emails the analyst from `rms@enamamc.com`. Returns nothing.

> Note: the guard condition mixes `&&`/`||` without parentheses, so profile/status filtering may be looser than the comment implies.

---

### 16. `send_meeting_Notes_Second_reminder`

- **Function name:** `send_meeting_Notes_Second_reminder`
- **Signature:** `void send_meeting_Notes_Second_reminder()`
- **Type:** Standalone function
- **GitHub:** [send_meeting_Notes_Second_reminder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/send_meeting_Notes_Second_reminder.js)

**What it does**

Second reminder chasing incomplete morning-meeting updates (attendance and/or notes) for today's meeting, with dynamically composed status text.

- Runs for today's meeting; skips weekends and exits if no meeting today.
- For each attendee, determines the attendance state from the join response and any `Morning_Meeting_Notes` rows, and whether real notes exist (`Morning_Notes` rows with a non-empty `Meet_Note`). Skips analysts who answered "No", and skips anyone with both attendance and notes complete.
- Composes a status/action block ("Attendance Not Marked / Meeting Notes Pending", etc.) plus a "Click here to update" link to the `Meeting_Notes` page, and asks for completion before 11:30 AM.
- Sends the email only when the analyst has an email and profile == "Analyst". Returns nothing.

---

### 17. `thirdMeetingNotesremainder`

- **Function name:** `thirdMeetingNotesremainder`
- **Signature:** `void thirdMeetingNotesremainder()`
- **Type:** Standalone function
- **GitHub:** [thirdMeetingNotesremainder.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Functions/thirdMeetingNotesremainder.js)

**What it does**

Third / final reminder for incomplete meeting notes and attendance. Very similar to the second reminder.

- Runs for today's meeting; skips weekends and exits if no meeting today.
- Skips analysts who responded "No" or are not active. For each remaining attendee, evaluates attendance state and whether any `Morning_Notes` with a non-empty `Meet_Note` exist, then skips anyone already complete.
- Composes the same dynamic status/action text with a "Click here to update" link to the `Meeting_Notes` page, deadline 11:30 AM.
- Sends the email when the analyst has an email and profile == "Analyst", and sets `Reminder_6 = true` on the notes records. Returns nothing.

> Note: unlike the second reminder, its notes lookup (`Morning_Meeting_Notes[Analyst.ID == analyst.ID]`) is not filtered to the current meeting.
