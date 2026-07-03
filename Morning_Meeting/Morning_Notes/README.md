# Form Workflows — Morning Notes

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Morning Notes

The Morning Notes form captures analyst notes raised for the morning meeting, keyed either to a **Company** or a **Sector**. Its workflows dynamically reshape the form based on the note type, restrict the selectable companies to those an analyst is authorised for, auto-populate company details (analyst, portfolio flag, price, recommendation) from master data, control edit access to already-stored records, hide internal/development fields, run type-specific submission validations, and — only when validation passes — mark the record as ready and store it. There are 8 form workflows and 1 reference screenshot.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `FI_AB_Enable_edit_access_` | FI_AB Enable edit access flag by default | Created – Load of the form | [FI_AB_Enable_edit_access_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Enable_edit_access_.js) |
| 2 | `FI_AB_Filter_Companies_fo` | FI_AB Filter Companies for User Profiles | Created or Edited – Load of the form | [FI_AB_Filter_Companies_fo.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Filter_Companies_fo.js) |
| 3 | `FI_AB_Hide_Dev_Fields` | FI_AB Hide Dev Fields | Created or Edited – Load of the form | [FI_AB_Hide_Dev_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Hide_Dev_Fields.js) |
| 4 | `FI_AB_Layout_Rules` | FI_AB Layout Rules | Created or Edited – Load of the form | [FI_AB_Layout_Rules.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Layout_Rules.js) |
| 5 | `FI_AB_Prevent_from_Editin` | FI_AB Prevent from Editing | Edited – Load of the form | [FI_AB_Prevent_from_Editin.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Prevent_from_Editin.js) |
| 6 | `FI_AB_Submit_it_as_Stored` | FI_AB Submit it as Stored | Created or Edited – Validations on form submission | [FI_AB_Submit_it_as_Stored.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Submit_it_as_Stored.js) |
| 7 | `FI_AB_Type_based_layout_r` | FI_AB Type based layout rules | Created or Edited – User input of Company / Sector? | [FI_AB_Type_based_layout_r.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Type_based_layout_r.js) |
| 8 | `FI_AB_populate_company_de` | FI_AB populate company details | Created or Edited – User input of Company Name | [FI_AB_populate_company_de.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_populate_company_de.js) |

## Workflow Details

### 1. `FI_AB Enable edit access flag by default`

- **Link name (file):** `FI_AB_Enable_edit_access_`
- **Workflow name:** `FI_AB Enable edit access flag by default`
- **Trigger / Event:** Created – Load of the form (new records only)
- **GitHub:** [FI_AB_Enable_edit_access_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Enable_edit_access_.js)

**What it does**

On loading a brand-new record, sets the control flags so the record is treated as freshly editable.

- Sets `Edit_Access = true`.
- Sets `Manual_Edit_Flag = true`.

These defaults feed into the edit-lock logic used by other workflows (see the "Prevent from Editing" workflow).

---

### 2. `FI_AB Filter Companies for User Profiles`

- **Link name (file):** `FI_AB_Filter_Companies_fo`
- **Workflow name:** `FI_AB Filter Companies for User Profiles`
- **Trigger / Event:** Created or Edited – Load of the form
- **GitHub:** [FI_AB_Filter_Companies_fo.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Filter_Companies_fo.js)

**What it does**

Restricts the choices available in the `Company_Name` lookup according to the logged-in user's profile, drawn from the `User_Master` record matched on their login email.

- Looks up the current user in `User_Master` by `Email_Id == zoho.loginuserid`.
- Preserves the current `Company_Name` value (`currValue`) so it is not lost while the option list is rebuilt.
- If the profile is **"Analyst Admin"**: populates the `Company_Name` options with every `Company_Universe` record that has a non-null `Analyst2`.
- If the profile is **"Analyst"**: populates the `Company_Name` options with only the `Company_Universe` records where `Analyst2` equals the user's `User_Master` ID (i.e., companies assigned to that analyst).
- After adding the filtered list, restores `Company_Name` back to `currValue` (done inside each branch and again at the end).

---

### 3. `FI_AB Hide Dev Fields`

- **Link name (file):** `FI_AB_Hide_Dev_Fields`
- **Workflow name:** `FI_AB Hide Dev Fields`
- **Trigger / Event:** Created or Edited – Load of the form
- **GitHub:** [FI_AB_Hide_Dev_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Hide_Dev_Fields.js)

**What it does**

Hides internal/development-only fields from the user-facing form on load.

- Hides `Remove_Time`, `Removed_List`, `Record_Status1`, and the entire `Dev_Section`.

---

### 4. `FI_AB Layout Rules`

- **Link name (file):** `FI_AB_Layout_Rules`
- **Workflow name:** `FI_AB Layout Rules`
- **Trigger / Event:** Created or Edited – Load of the form
- **GitHub:** [FI_AB_Layout_Rules.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Layout_Rules.js)

**What it does**

The main on-load layout engine. It fixes the analyst, then reshapes the form for the note type (Company vs Sector) and pre-fills company-linked data from master tables.

- Disables the `Analyst` field so it cannot be changed manually.
- Sets `Manual_Edit_Flag = true`.
- If `Analyst` is empty, defaults it to the logged-in user's `User_Master` ID (matched on `Email_Id`).
- **When `Company_Sector == "Company"`:** shows `Company_Name`, `Recommendation`, `Event_update`, `Portfolio_Stock`, `New_Ideas`, `Topic_Header`, `Outlook_View`, `Price_as_on`, `Target_price`; hides `Tag` and `Sector_Name`.
- **When `Company_Sector == "Sector"`:** shows `Sector_Name`, `Event_update`, `New_Ideas`, `Topic_Header`, `Tag`, `Outlook_View`; hides `Company_Name`, `Recommendation`, `Portfolio_Stock`, `Price_as_on`, `Target_price`.
- **When a `Company_Name` is selected**, looks up the matching `Company_Universe` record and:
  - If `Part_of_Folio == "Yes"`: sets `Portfolio_Stock = "Yes"` and disables `Portfolio_Stock`.
  - Looks up `Price_Master` for that company. If a price record exists, populates `Price_as_on` with its `Closing_Price` and disables `Price_as_on`.
  - If no price record exists: clears `Price_as_on`, sets `Portfolio_Stock = "No"`, `Recommendation = "Not Rated"`, `Target_price = 0`, and disables `Target_price`, `Recommendation`, and `Portfolio_Stock`.
- A commented-out line references `Return_field` (not active).

---

### 5. `FI_AB Prevent from Editing`

- **Link name (file):** `FI_AB_Prevent_from_Editin`
- **Workflow name:** `FI_AB Prevent from Editing`
- **Trigger / Event:** Edited – Load of the form (existing records only)
- **GitHub:** [FI_AB_Prevent_from_Editin.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Prevent_from_Editin.js)

**What it does**

Blocks editing of records that are already finalised.

- If `Edit_Access == false` **and** `Record_Status1 == "Stored"`, it closes/refreshes the form by calling `openUrl("#Script:page.parent.refresh ", "parent window")`, effectively bouncing the user out of the edit view of a stored record.

---

### 6. `FI_AB Submit it as Stored`

- **Link name (file):** `FI_AB_Submit_it_as_Stored`
- **Workflow name:** `FI_AB Submit it as Stored`
- **Trigger / Event:** Created or Edited – Validations on form submission
- **GitHub:** [FI_AB_Submit_it_as_Stored.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Submit_it_as_Stored.js)

**What it does**

Runs all mandatory-field validations on submit, building a list of missing items, and only marks the record ready to submit if every required field for the chosen note type is present.

- Initialises `validationPass = true` and an `invalidList` string that accumulates the names of missing fields.
- **Always required:** `Meet_Note` and `Company_Sector` must be non-empty (adds "Company/Sector?" and/or "Meet Note" to the list otherwise).
- **When `Company_Sector == "Company"`:** requires `Company_Name`, `Recommendation`, `Event_update`, `Portfolio_Stock`, `New_Ideas`, `Topic_Header`, and `Outlook_View`; each missing field is appended to `invalidList`. Additionally, if `Price_as_on` is not null, then `Target_price` must be non-zero/non-null (else "Target Price" is flagged).
- **When `Company_Sector == "Sector"`:** requires `Sector_Name`, `Event_update`, `New_Ideas`, `Topic_Header`, `Tag`, and `Outlook_View`; each missing field is appended to `invalidList`.
- If `validationPass == true` at the end, sets `Ready_to_Submit = true` (the flag that marks the record for storing). The whole block was originally gated on `Manual_Edit_Flag == true`, but that condition is commented out.
- Note: `invalidList` is built up but not surfaced via a message in this snippet; it drives the pass/fail decision through the individual `validationPass = false` assignments.

---

### 7. `FI_AB Type based layout rules`

- **Link name (file):** `FI_AB_Type_based_layout_r`
- **Workflow name:** `FI_AB Type based layout rules`
- **Trigger / Event:** Created or Edited – User input of `Company / Sector?`
- **GitHub:** [FI_AB_Type_based_layout_r.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_Type_based_layout_r.js)

**What it does**

The on-field-change counterpart to the layout rules: when the user picks Company or Sector, it immediately shows/hides the relevant field set (same show/hide logic as the load-time Layout Rules, without the master-data population).

- **When `Company_Sector == "Company"`:** shows `Company_Name`, `Recommendation`, `Event_update`, `Portfolio_Stock`, `New_Ideas`, `Topic_Header`, `Outlook_View`, `Price_as_on`, `Target_price`; hides `Tag` and `Sector_Name`.
- **When `Company_Sector == "Sector"`:** shows `Sector_Name`, `Event_update`, `New_Ideas`, `Topic_Header`, `Tag`, `Outlook_View`; hides `Company_Name`, `Recommendation`, `Portfolio_Stock`, `Price_as_on`, `Target_price`.

---

### 8. `FI_AB populate company details`

- **Link name (file):** `FI_AB_populate_company_de`
- **Workflow name:** `FI_AB populate company details`
- **Trigger / Event:** Created or Edited – User input of `Company Name`
- **GitHub:** [FI_AB_populate_company_de.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/FI_AB_populate_company_de.js)

**What it does**

When the user selects a company, auto-fills analyst and price/portfolio/recommendation details from master data and toggles field editability accordingly.

- Looks up the selected company in `Company_Universe` by `ID == input.Company_Name`.
- If the company's `Analyst2` is set, assigns it to the `Analyst` field.
- If `Part_of_Folio == "Yes"`: sets `Portfolio_Stock = "Yes"` (the accompanying disable line is commented out); otherwise enables `Portfolio_Stock`.
- Looks up `Price_Master` for the company:
  - If a price record exists: populates `Price_as_on` with `Closing_Price`, disables `Price_as_on`, and enables `Target_price`, `Recommendation`, and `Portfolio_Stock`.
  - If no price record exists: clears `Price_as_on`, sets `Portfolio_Stock = "No"`, `Recommendation = "Not Rated"`, `Target_price = 0`, and disables `Target_price`, `Recommendation`, and `Portfolio_Stock`.

---

## Reference Screenshots

- **[show_hide_fields_based_on.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Morning_Notes/show_hide_fields_based_on.png)** — Form configuration screenshot illustrating the show/hide field behaviour driven by the Company/Sector selection (relates to the Layout Rules and Type-based layout rules workflows).
