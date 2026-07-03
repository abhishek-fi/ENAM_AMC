# Form Workflows — Company Meeting

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Meeting · **Form:** Company Meeting

The **Company Meeting** form captures records of meetings held with companies from the investment universe. Its workflows handle three broad concerns: (1) pre-filling and locking fields on load — defaulting "Meeting Was Attended", stamping the logged-in analyst, filtering the Company picklist to the analyst's own companies, and hiding developer/cancellation fields; (2) reacting to user input — validating meeting start/end times, fetching a company's SEDOL and closing price, computing the Return % and Upside/Downside from target price, and showing/hiding the Cancellation Reason field based on Status; and (3) enforcing data quality on submit — a full field-completeness check gated by a manual-edit flag, a dedicated cancellation-reason check, and a post-submit redirect to the "My Company Meetings" report. A no-code Field rule additionally keeps the computed Return % and Upside/Downside fields read-only.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Check_if_before_To_Time` | Check if before To Time | Created or Edited · User input of Meeting Time from | [Check_if_before_To_Time.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Check_if_before_To_Time.js) |
| 2 | `Default_value_for_meeting` | Default value for meeting was attended | Created · Load of the form | [Default_value_for_meeting.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Default_value_for_meeting.js) |
| 3 | `FI_AB_Filter_Companies_fo1` | FI_AB Filter Companies for User Profiles | Created or Edited · Load of the form | [FI_AB_Filter_Companies_fo1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/FI_AB_Filter_Companies_fo1.js) |
| 4 | `FI_AB_open_my_companies_r` | FI_AB open my companies report | Created · Successful form submission | [FI_AB_open_my_companies_r.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/FI_AB_open_my_companies_r.js) |
| 5 | `Fetch_Closing_Price_and_S1` | Fetch Closing Price and SEDOL of the Company | Created or Edited · User input of Company Name | [Fetch_Closing_Price_and_S1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Fetch_Closing_Price_and_S1.js) |
| 6 | `Hide_Cancellation_Reason_` | Hide Cancellation Reason field | Created or Edited · Load of the form | [Hide_Cancellation_Reason_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Hide_Cancellation_Reason_.js) |
| 7 | `Populate_closing_price_of` | Populate closing price of company | Edited · Load of the form | [Populate_closing_price_of.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Populate_closing_price_of.js) |
| 8 | `Show_Cancellation_Reason` | Show Cancellation Reason | Created or Edited · User input of Status | [Show_Cancellation_Reason.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Show_Cancellation_Reason.js) |
| 9 | `Update_Analyst_Field` | Update Analyst Field | Created · Load of the form | [Update_Analyst_Field.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_Analyst_Field.js) |
| 10 | `Update_the_Return_Percent` | Update the Return Percent | Created or Edited · User input of Target price | [Update_the_Return_Percent.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_the_Return_Percent.js) |
| 11 | `Update_the_Upside_Downsid` | Update the Upside Downside Field | Created or Edited · User input of Return (%) | [Update_the_Upside_Downsid.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_the_Upside_Downsid.js) |
| 12 | `Validate_All_Fields_are_f` | Validate All Fields are filled | Created or Edited · Validations on form submission | [Validate_All_Fields_are_f.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_All_Fields_are_f.js) |
| 13 | `Validate_Cancellation_Rea` | Validate Cancellation Reason is Provided | Created or Edited · Validations on form submission | [Validate_Cancellation_Rea.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_Cancellation_Rea.js) |
| 14 | `Validate_From_Time` | Validate From Time | Created or Edited · User input of Meeting Time to | [Validate_From_Time.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_From_Time.js) |
| 15 | `dev_section` | dev section | Created or Edited · Load of the form | [dev_section.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/dev_section.js) |
| 16 | `dev_section1` | dev section | Created or Edited · Successful form submission | [dev_section1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/dev_section1.js) |
| 17 | `Make_field_read_only` (screenshot) | Make field read-only | Created or Edited · Field rule (form load & field input) | [Make_field_read_only.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Make_field_read_only.png) |

## Workflow Details

### 1. `Check if before To Time`

- **Link name (file):** `Check_if_before_To_Time`
- **Workflow name:** `Check if before To Time`
- **Trigger / Event:** Created or Edited — User input of Meeting Time from
- **GitHub:** [Check_if_before_To_Time.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Check_if_before_To_Time.js)

**What it does**

Runs when the user enters the **Meeting Time from** field (a header comment notes it is meant to execute only if `Meeting_Time_to` is not null). It reads `Meeting_Time_from` and `Meeting_Time_to`. If the from-time is greater than or equal to the to-time, it shows the alert "From Time cannot be after or same as the End Time." and clears the **Meeting Time from** field (`input.Meeting_Time_from = ""`).

---

### 2. `Default value for meeting was attended`

- **Link name (file):** `Default_value_for_meeting`
- **Workflow name:** `Default value for meeting was attended`
- **Trigger / Event:** Created — Load of the form
- **GitHub:** [Default_value_for_meeting.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Default_value_for_meeting.js)

**What it does**

On load of a new record, sets the **Meeting Was Attended** field to `"Yes"` as the default value.

---

### 3. `FI_AB Filter Companies for User Profiles`

- **Link name (file):** `FI_AB_Filter_Companies_fo1`
- **Workflow name:** `FI_AB Filter Companies for User Profiles`
- **Trigger / Event:** Created or Edited — Load of the form
- **GitHub:** [FI_AB_Filter_Companies_fo1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/FI_AB_Filter_Companies_fo1.js)

**What it does**

On form load, looks up the current user in **User_Master** by matching `Email_Id` to `zoho.loginuserid`, and remembers the currently selected **Company Name** value. If the user's **Profile** is `"Analyst"`, it queries **Company_Universe** for all IDs where `Analyst2` equals the user's ID and restricts the **Company Name** picklist to that list via `input.Company_Name:ui.add(compList)`. It then restores the previously selected company value (done both inside the `if` block and again unconditionally at the end).

---

### 4. `FI_AB open my companies report`

- **Link name (file):** `FI_AB_open_my_companies_r`
- **Workflow name:** `FI_AB open my companies report`
- **Trigger / Event:** Created — Successful form submission
- **GitHub:** [FI_AB_open_my_companies_r.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/FI_AB_open_my_companies_r.js)

**What it does**

After a new record is successfully submitted, redirects the user to the **My_Company_Meetings** report in the same window via `openUrl("#Report:My_Company_Meetings","same window")`.

---

### 5. `Fetch Closing Price and SEDOL of the Company`

- **Link name (file):** `Fetch_Closing_Price_and_S1`
- **Workflow name:** `Fetch Closing Price and SEDOL of the Company`
- **Trigger / Event:** Created or Edited — User input of Company Name
- **GitHub:** [Fetch_Closing_Price_and_S1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Fetch_Closing_Price_and_S1.js)

**What it does**

When the user selects a **Company Name**, it looks up that company in **Company_Universe** (by record ID) to read its `CD_ISIN_No` and `SEDOL`. It temporarily enables the **SEDOL** field, writes the fetched SEDOL into it, then disables it again (making it read-only). It then queries **Price_Master** for the `Closing_Price` matching the company's ISIN, writes it into **Closing Price** (defaulting to `0.00` via `ifNull` when no price is found), and disables the **Closing Price** field.

---

### 6. `Hide Cancellation Reason field`

- **Link name (file):** `Hide_Cancellation_Reason_`
- **Workflow name:** `Hide Cancellation Reason field`
- **Trigger / Event:** Created or Edited — Load of the form
- **GitHub:** [Hide_Cancellation_Reason_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Hide_Cancellation_Reason_.js)

**What it does**

On form load, hides the **Cancellation Reason** field. (It is later shown by the "Show Cancellation Reason" workflow only when Status is "Cancelled".)

---

### 7. `Populate closing price of company`

- **Link name (file):** `Populate_closing_price_of`
- **Workflow name:** `Populate closing price of company`
- **Trigger / Event:** Edited — Load of the form
- **GitHub:** [Populate_closing_price_of.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Populate_closing_price_of.js)

**What it does**

When an existing record is opened for editing, it re-derives the company's ISIN from **Company_Universe** using the stored **Company Name**, then looks up the `Closing_Price` in **Price_Master** for that ISIN and writes it into **Closing Price** (defaulting to `0.00` via `ifNull`). It disables the **Closing Price** field so it stays read-only.

---

### 8. `Show Cancellation Reason`

- **Link name (file):** `Show_Cancellation_Reason`
- **Workflow name:** `Show Cancellation Reason`
- **Trigger / Event:** Created or Edited — User input of Status
- **GitHub:** [Show_Cancellation_Reason.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Show_Cancellation_Reason.js)

**What it does**

When the user changes **Status**: if the value is `"Cancelled"`, it shows the **Cancellation Reason** field; otherwise it hides it.

---

### 9. `Update Analyst Field`

- **Link name (file):** `Update_Analyst_Field`
- **Workflow name:** `Update Analyst Field`
- **Trigger / Event:** Created — Load of the form
- **GitHub:** [Update_Analyst_Field.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_Analyst_Field.js)

**What it does**

On load of a new record, looks up the logged-in user (`zoho.loginuserid`) in **User_Master** by `Email_Id`, reads the user's **Profile**, and sets **Analyst Name** to that user's record ID. If the profile is `"Analyst"`, it disables the **Analyst Name** field so an analyst cannot change it.

---

### 10. `Update the Return Percent`

- **Link name (file):** `Update_the_Return_Percent`
- **Workflow name:** `Update the Return Percent`
- **Trigger / Event:** Created or Edited — User input of Target price
- **GitHub:** [Update_the_Return_Percent.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_the_Return_Percent.js)

**What it does**

When the user enters a **Target price**, it computes the return percentage as `((Target_price - Closing_Price) / Closing_Price * 100)` rounded to 2 decimals and writes it into the **Return Percent** field.

---

### 11. `Update the Upside Downside Field`

- **Link name (file):** `Update_the_Upside_Downsid`
- **Workflow name:** `Update the Upside Downside Field`
- **Trigger / Event:** Created or Edited — User input of Return (%)
- **GitHub:** [Update_the_Upside_Downsid.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Update_the_Upside_Downsid.js)

**What it does**

When the **Return (%)** field changes, it sets **Upside/Downside** to `"Downside"` if the return percent is `<= 0`, or to `"Upside"` if it is `> 0`.

---

### 12. `Validate All Fields are filled`

- **Link name (file):** `Validate_All_Fields_are_f`
- **Workflow name:** `Validate All Fields are filled`
- **Trigger / Event:** Created or Edited — Validations on form submission
- **GitHub:** [Validate_All_Fields_are_f.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_All_Fields_are_f.js)

**What it does**

Runs on submission but only when `Manual_Edit_Flag == true` (this flag is set true on load by the "dev section" workflow and set false after a successful submit). It uses a `validationFailed` accumulator pattern: each check raises a field-level `alert` and sets the flag rather than cancelling immediately, so all missing-field messages surface together. Required-field checks cover: Meeting Time from, Meeting Time to, Type of meeting, Company Name, Meeting Location, Status, Title of Company Attendees, Part of Investment Universe, Part of any of the portfolio on the date of meeting, Meeting Was Attended, Name of Fund Manager attended the meeting, Has CIO attended the meeting, Meeting Organized by Broker, and Meeting Note. Conditional checks: if Status is "Cancelled", Cancellation Reason must be filled; if Meeting Organized by Broker is "Yes", Broker name must be filled; and a target-price check `if(Closing_Price != 0 && Target_price == 0 || Target_price == null)` requiring Target Price to be non-zero/non-null. Finally, if `validationFailed` is true, it issues `cancel submit` to block the submission.

---

### 13. `Validate Cancellation Reason is Provided`

- **Link name (file):** `Validate_Cancellation_Rea`
- **Workflow name:** `Validate Cancellation Reason is Provided`
- **Trigger / Event:** Created or Edited — Validations on form submission
- **GitHub:** [Validate_Cancellation_Rea.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_Cancellation_Rea.js)

**What it does**

On submission, checks the condition `input.Status == "Cancelled" && input.Cancellation_Reason == null || input.Cancellation_Reason == ""`. If it evaluates true, it shows the alert "Kindly provide the cancellation reason." and issues `cancel submit`.

---

### 14. `Validate From Time`

- **Link name (file):** `Validate_From_Time`
- **Workflow name:** `Validate From Time`
- **Trigger / Event:** Created or Edited — User input of Meeting Time to
- **GitHub:** [Validate_From_Time.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Validate_From_Time.js)

**What it does**

The counterpart to workflow #1. Runs when the user enters **Meeting Time to** (header comment notes it should execute only if `Meeting_Time_from` is not null). It compares from-time and to-time; if `fromTime >= endTime`, it shows the alert "From time cannot be after or same as the End time." and clears the **Meeting Time to** field (`input.Meeting_Time_to = ""`).

---

### 15. `dev section`

- **Link name (file):** `dev_section`
- **Workflow name:** `dev section`
- **Trigger / Event:** Created or Edited — Load of the form
- **GitHub:** [dev_section.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/dev_section.js)

**What it does**

On form load, hides the **Dev Section**, sets **Manual Edit Flag** to `true` (which arms the "Validate All Fields are filled" check on submit), and disables the **SEDOL** field to keep it read-only.

---

### 16. `dev section`

- **Link name (file):** `dev_section1`
- **Workflow name:** `dev section`
- **Trigger / Event:** Created or Edited — Successful form submission
- **GitHub:** [dev_section1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/dev_section1.js)

**What it does**

After a successful submission, sets **Manual Edit Flag** back to `false`.

---

## Field Rule Workflows (no-code configuration)

These are built with Zoho Creator's built-in **Field rules** (no Deluge). They run on form load and on user input of participating fields. The screenshot captures the config.

### 17. `Make field read-only`

- **Link name (file):** `Make_field_read_only` (screenshot)
- **Workflow name:** `Make field read-only`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Make_field_read_only.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Meeting/Make_field_read_only.png)

**What it does**

Breadcrumb: **Company Meeting > Created or Edited > Field rules > Make field read-only**. The rule runs **without condition** ("Execute without condition") and performs a single action: **Disable fields [Return_Percent, Upside_Downside]**. This makes the **Return Percent** and **Upside/Downside** fields read-only in the UI, so they can only be populated by the computation workflows (#10 and #11) and not edited directly by the user.
