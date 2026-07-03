# Form Workflows — Company Universe

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Form:** Company Universe

The **Company Universe** form is the master record for a company being tracked, evaluated, and (eventually) added to the ENAM investment universe. It drives two multi-stage approval processes: the **Universe Addition** flow (Analyst → Fund Managers at levels FM1/FM2/FM3 across review rounds L1/L2/L3 → Head of Research) and a separate **Focus List Addition** flow (Analyst → CIO → FM 1 → FM 2 → Head of Research). The workflows in this folder fall into two broad categories. First, **field-control rules** that run on form load / submission — disabling identity fields, hiding process-tracking fields, disabling reviewer comment boxes based on the logged-in user, and validating that mandatory comments are filled (several of these are commented-out/disabled because the actual editing happens in a custom widget). Second, **status- and field-update email notifications** — the large set of "Send Email / Send approval email" workflows that fire when a reviewer's status field changes (Approved / Rejected / Clarification Needed / Re-Submit) or when a Fund Manager name is assigned, routing notifications to the analyst, the relevant fund manager, the CIO, or the Head of Research (resolved via `User_Master` lookups by Profile or by record ID). Every email also sends a "Copy - ..." to `parth@fristinetech.com` for monitoring. All mail is sent from `rms@enamamc.com`.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `DisableFI_AB_Focus_List_C` | DisableFI_AB Focus List CIO Approval Request email (Not required) | On update of Focus List In-Progress (user input) | [DisableFI_AB_Focus_List_C.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/DisableFI_AB_Focus_List_C.js) |
| 2 | `FI_AB_Approval_request_em` | FI_AB Approval request email | On update of Focus List Stage | [FI_AB_Approval_request_em.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Approval_request_em.js) |
| 3 | `FI_AB_Disable_fields` | FI_AB Disable fields | On load (Created or Edited) | [FI_AB_Disable_fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Disable_fields.js) |
| 4 | `FI_AB_Disable_fields_base` | FI_AB Disable fields based on loggedin user | On load (Edited) | [FI_AB_Disable_fields_base.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Disable_fields_base.js) |
| 5 | `FI_AB_Focus_List_Added_em` | FI_AB Focus List Added email | On update of Part of Focus List | [FI_AB_Focus_List_Added_em.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Added_em.js) |
| 6 | `FI_AB_Focus_List_Clarific` | FI_AB Focus List Clarification Request email | On update of Focus List Stage | [FI_AB_Focus_List_Clarific.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Clarific.js) |
| 7 | `FI_AB_Focus_List_Rejected` | FI_AB Focus List Rejected notification | On update of Focus List Stage | [FI_AB_Focus_List_Rejected.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Rejected.js) |
| 8 | `FI_AB_Hide_Fields` | FI_AB Hide Fields | On load (Created or Edited) | [FI_AB_Hide_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Hide_Fields.js) |
| 9 | `FI_AB_Mandate_fields_duri2` | FI_AB Mandate fields during transition L1 Review (Disabled) | On submission (validation) | [FI_AB_Mandate_fields_duri2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri2.js) |
| 10 | `FI_AB_Mandate_fields_duri3` | FI_AB Mandate fields during L2 Approval (Disabled) | On submission (validation) | [FI_AB_Mandate_fields_duri3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri3.js) |
| 11 | `FI_AB_Mandate_fields_duri4` | FI_AB Mandate fields during L1 Approval (Disabled) | On submission (validation) | [FI_AB_Mandate_fields_duri4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri4.js) |
| 12 | `FI_AB_Mandate_fields_duri5` | FI_AB Mandate fields during L3 Approval (Disabled) | On submission (validation) | [FI_AB_Mandate_fields_duri5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri5.js) |
| 13 | `FI_PB_Focus_List_Clarific` | FI_PB Focus List Clarification Provided Email | On update of Focus List Stage | [FI_PB_Focus_List_Clarific.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_PB_Focus_List_Clarific.js) |
| 14 | `Hide_Filed` | Hide Filed | On load (Created or Edited) | [Hide_Filed.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Hide_Filed.js) |
| 15 | `Mandate_fields2` | Mandate fields (Not required) | On submission (validation) | [Mandate_fields2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Mandate_fields2.js) |
| 16 | `Mandate_fields3` | Mandate fields (Not required) | On submission (validation) | [Mandate_fields3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Mandate_fields3.js) |
| 17 | `Send_Email_On_L3_FM1_Stat` | Send Email On L3 FM1 Status | On update of L3 FM1 Status | [Send_Email_On_L3_FM1_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_On_L3_FM1_Stat.js) |
| 18 | `Send_Email_On_Status_L2_F` | Send Email On Status L2 FM2 Status | On update of L2 FM2 Status | [Send_Email_On_Status_L2_F.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_On_Status_L2_F.js) |
| 19 | `Send_Email_on_FM1_Status` | Send Email on FM1 Status | On update of FM1 Status | [Send_Email_on_FM1_Status.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_FM1_Status.js) |
| 20 | `Send_Email_on_FM2_Status` | Send Email on FM2 Status | On update of FM2 Status | [Send_Email_on_FM2_Status.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_FM2_Status.js) |
| 21 | `Send_Email_on_L2_FM1_Stat` | Send Email on L2 FM1 Status | On update of L2 FM1 Status | [Send_Email_on_L2_FM1_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM1_Stat.js) |
| 22 | `Send_Email_on_L2_FM3_Name` | Send Email on L2 FM3 Name | On update of L2 FM3 Name | [Send_Email_on_L2_FM3_Name.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM3_Name.js) |
| 23 | `Send_Email_on_L2_FM3_Stat` | Send Email on L2 FM3 Status | On update of L2 FM3 Status | [Send_Email_on_L2_FM3_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM3_Stat.js) |
| 24 | `Send_Email_on_L2_HoR_Stat` | Send Email on L2 HoR Status | On update of L2 HoR Status | [Send_Email_on_L2_HoR_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_HoR_Stat.js) |
| 25 | `Send_Email_on_L3_FM2_Stat` | Send Email on L3 FM2 Status | On update of L3 FM2 Status | [Send_Email_on_L3_FM2_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_FM2_Stat.js) |
| 26 | `Send_Email_on_L3_FM3_Stat` | Send Email on L3 FM3 Status | On update of L3 FM3 Status | [Send_Email_on_L3_FM3_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_FM3_Stat.js) |
| 27 | `Send_Email_on_L3_HoR_Stat` | Send Email on L3 HoR Status | On update of L3 HoR Status | [Send_Email_on_L3_HoR_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_HoR_Stat.js) |
| 28 | `Send_Email_to_Analyst1` | Send Email to Analyst | On update of FM 3 Status | [Send_Email_to_Analyst1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_Analyst1.js) |
| 29 | `Send_Email_to_Hor` | Send Email to Hor | On update of HoR Status | [Send_Email_to_Hor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_Hor.js) |
| 30 | `Send_Email_to_fm_3` | Send Email to fm 3 | On update of FM3 Name | [Send_Email_to_fm_3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_fm_3.js) |
| 31 | `Send_Email_to_l3_Fm3` | Send Email to l3 Fm3 | On update of L3 FM3 Name | [Send_Email_to_l3_Fm3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_l3_Fm3.js) |
| 32 | `Send_approval_email_to_fm` | Send approval email to fm1 | On update of FM1 Name | [Send_approval_email_to_fm.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_fm.js) |
| 33 | `Send_approval_email_to_fm1` | Send approval email to fm2 | On update of FM2 Name | [Send_approval_email_to_fm1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_fm1.js) |
| 34 | `Send_approval_email_to_l2` | Send approval email to l2 fm1 | On update of L2 FM1 Name | [Send_approval_email_to_l2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l2.js) |
| 35 | `Send_approval_email_to_l3` | Send approval email to l2 fm2 | On update of L2 FM2 Name | [Send_approval_email_to_l3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l3.js) |
| 36 | `Send_approval_email_to_l4` | Send approval email to l3 fm1 | On update of L3 FM1 Name | [Send_approval_email_to_l4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l4.js) |
| 37 | `Send_approval_email_to_l5` | Send approval email to l3 fm2 | On update of L3 FM2 Name | [Send_approval_email_to_l5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l5.js) |

## Workflow Details

### 1. `DisableFI_AB Focus List CIO Approval Request email`

- **Link name (file):** `DisableFI_AB_Focus_List_C`
- **Workflow name:** `DisableFI_AB Focus List CIO Approval Request email` (marked "Not required")
- **Trigger / Event:** On update of `Focus List In-Progress` (user input of Focus List In-Progress)
- **GitHub:** [DisableFI_AB_Focus_List_C.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/DisableFI_AB_Focus_List_C.js)

**What it does**

An older/deprecated focus-list CIO approval-request notification, superseded by workflow #2.

- Builds a link to the `Focus_List_Addition` page for the record.
- Looks up the Head of Research in `User_Master` (`Profile == "Head of Reseqarch"` — note the typo), but the recipient email is **hard-coded to `abhishek@fristinetech.com`** rather than the looked-up email.
- Emails an "Approval Required – New Focus List Submission" message showing Company Name, submitter (`Analyst2.Full_Name`), and submission date (`Focus_List_Initiated_Time`), with a review link.
- The first-line comment flags it as not required.

---

### 2. `FI_AB Approval request email`

- **Link name (file):** `FI_AB_Approval_request_em`
- **Workflow name:** `FI_AB Approval request email`
- **Trigger / Event:** On update of `Focus List Stage` (runs only when `Focus_List_In_Progress == true` and stage is "Submitted for Review", "CIO Approved", "FM 1 Approved", or "FM 2 Approved")
- **GitHub:** [FI_AB_Approval_request_em.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Approval_request_em.js)

**What it does**

Routes the focus-list approval request to the next approver in the chain based on the current stage.

- **Submitted for Review** → CIO (`User_Master[Profile == "CIO"]`).
- **CIO Approved** → FM 1 (`User_Master[ID == FM_1_Name]`).
- **FM 1 Approved** → FM 2 (`User_Master[ID == FM_2_Name]`).
- **FM 2 Approved** → Head of Research (`User_Master[Profile == "Head of Research"]`).
- Sends "Focus List Submission Awaiting Your Approval – <Company>" with Company Name, submitter, submission date, and an approval link to the `Focus_List_Addition` page.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 3. `FI_AB Disable fields`

- **Link name (file):** `FI_AB_Disable_fields`
- **Workflow name:** `FI_AB Disable fields`
- **Trigger / Event:** On load of the form (Created or Edited)
- **GitHub:** [FI_AB_Disable_fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Disable_fields.js)

**What it does**

Locks the externally-sourced company identifier fields so they cannot be edited on the form:

- Disables `CD_BSE_Code`, `CD_NSE_Symbol`, `CD_Bloomberg_Code`, and `CD_ISIN_No`.

---

### 4. `FI_AB Disable fields based on loggedin user`

- **Link name (file):** `FI_AB_Disable_fields_base`
- **Workflow name:** `FI_AB Disable fields based on loggedin user`
- **Trigger / Event:** On load of the form (Edited)
- **GitHub:** [FI_AB_Disable_fields_base.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Disable_fields_base.js)

**What it does**

Restricts each fund manager to editing only their own comment boxes across the L1/L2/L3 review rounds. The first comment notes it is currently unused because all editing happens in the widget.

- If the logged-in user is **FM 1** → disables all FM 2, FM 3, and HoR comment fields (L1/L2/L3).
- If **FM 2** → disables all FM 1, FM 3, and HoR comment fields.
- If **FM 3** → disables all FM 1, FM 2, and HoR comment fields.
- If `zoho@enamamc.com` (admin/HoR proxy) → disables all FM 1, FM 2, and FM 3 comment fields (leaving HoR comments editable).
- Otherwise (any other user) → disables every FM 1/2/3 and HoR comment field.

---

### 5. `FI_AB Focus List Added email`

- **Link name (file):** `FI_AB_Focus_List_Added_em`
- **Workflow name:** `FI_AB Focus List Added email`
- **Trigger / Event:** On update of `Part of Focus List` (runs only when `Part_of_Focus_List == "Yes"`)
- **GitHub:** [FI_AB_Focus_List_Added_em.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Added_em.js)

**What it does**

Notifies the analyst that a company has been added to the focus list.

- Sends "New Company Added to Focus List – <Company>" to the analyst (`Analyst2.Email_Id`), listing Company Name, added-by (analyst), date added, and a link to view the focus list.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 6. `FI_AB Focus List Clarification Request email`

- **Link name (file):** `FI_AB_Focus_List_Clarific`
- **Workflow name:** `FI_AB Focus List Clarification Request email`
- **Trigger / Event:** On update of `Focus List Stage` (runs only when `Focus_List_In_Progress == true` and stage is "CIO Clarification Request", "FM 1 Clarification Request", "FM 2 Clarification Request", or "HoR Clarification Request")
- **GitHub:** [FI_AB_Focus_List_Clarific.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Clarific.js)

**What it does**

When an approver asks the analyst for clarification, emails the analyst with the approver's comments.

- Recipient is always the analyst (`Analyst2.Email_Id`).
- Pulls the approver's comment from the matching stage subform: CIO → `Focus_List_CIO_Stage.CIO_Comment`, FM 1 → `Focus_List_FM_1_Stage.FM_1_Comment`, FM 2 → `Focus_List_FM_2_Stage.FM_2_Comment`, HoR → `Focus_List_HoR_Stage.HoR_Comment`.
- Sends "Clarification Requested – Focus List Submission for <Company>" with the approver comments and an update link.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 7. `FI_AB Focus List Rejected notification`

- **Link name (file):** `FI_AB_Focus_List_Rejected`
- **Workflow name:** `FI_AB Focus List Rejected notification`
- **Trigger / Event:** On update of `Focus List Stage` (runs only when stage is "Rejected by CIO", "Rejected by FM 1", "Rejected by FM 2", or "Rejected by HoR")
- **GitHub:** [FI_AB_Focus_List_Rejected.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Focus_List_Rejected.js)

**What it does**

Broadcasts a rejection notice to the whole research team.

- Builds a recipient list including the analyst, CIO and Head of Research (via `User_Master` profile lookups), FM 1, and FM 2 emails.
- Identifies the rejecting approver and pulls their rejection comment from the matching stage subform (CIO/FM 1/FM 2/HoR).
- Sends "Focus List Submission Rejected – <Company>" listing rejected-by, rejection date, and reason, with a view link.
- Sends a "Copy - ..." to `parth@fristinetech.com` (its subject concatenates the full email body and the team list).

---

### 8. `FI_AB Hide Fields`

- **Link name (file):** `FI_AB_Hide_Fields`
- **Workflow name:** `FI_AB Hide Fields`
- **Trigger / Event:** On load of the form (Created or Edited)
- **GitHub:** [FI_AB_Hide_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Hide_Fields.js)

**What it does**

Hides internal process-tracking / flag fields from the form view:

- Hides `Detailed_Presentation_Added`, `Pre_assessment_Presentation_Added`, `Focus_List_In_Progress`, `Universe_Addition_In_Progress`, `Deletion_Process_Flow`, and `Focus_Flow_Comments`. (`Dev_Section` is left commented out.)

---

### 9. `FI_AB Mandate fields during transition L1 Review`

- **Link name (file):** `FI_AB_Mandate_fields_duri2`
- **Workflow name:** `FI_AB Mandate fields during transition L1 Review` (marked "Disabled")
- **Trigger / Event:** On form submission (validation)
- **GitHub:** [FI_AB_Mandate_fields_duri2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri2.js)

**What it does**

Entirely commented out — no active logic. It was intended to require FM names and pre-assessment detail fields (Screener, Pre-assessment Presentation, Segmental revenues, Revenue/Margin drivers, Balance Sheet Structure, Capital allocation, Shareholding pattern, Liquidity details, etc.) before allowing submission during Universe Addition Initiated, cancelling submission otherwise.

---

### 10. `FI_AB Mandate fields during L2 Approval`

- **Link name (file):** `FI_AB_Mandate_fields_duri3`
- **Workflow name:** `FI_AB Mandate fields during L2 Approval` (marked "Disabled" in comment, but the code body is active)
- **Trigger / Event:** On form submission (validation), when `Manual_Edit_Flag == false` and `Custom_Stage == "Submitted for L2 Review"`
- **GitHub:** [FI_AB_Mandate_fields_duri3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri3.js)

**What it does**

Validates that the L2 review section and the logged-in reviewer's own L2 comment are filled before submission.

- Requires `Detailed_review_with_HoR_and_FMs1`, `Are_we_missing_anything1`, `Is_there_a_material_incremental_change_in_the_story1`, and `Any_other_critical_question_to_be_covered1` to be non-empty.
- Requires the current user's L2 comment: FM 1 → `FM_1_L2_Comment`, FM 2 → `FM_2_L2_Comment`, FM 3 → `FM_3_L2_Comment`, `zoho@enamamc.com` → `HoR_L2_Comment`.
- If any required field is empty, alerts "Please fill all the comments." and cancels the submit.

---

### 11. `FI_AB Mandate fields during L1 Approval`

- **Link name (file):** `FI_AB_Mandate_fields_duri4`
- **Workflow name:** `FI_AB Mandate fields during L1 Approval` (marked "Disabled" in comment, but the code body is active)
- **Trigger / Event:** On form submission (validation), when `Manual_Edit_Flag == false` and `Custom_Stage == "Submitted for L1 Review"`
- **GitHub:** [FI_AB_Mandate_fields_duri4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri4.js)

**What it does**

L1-round equivalent of #10.

- Requires `Detailed_review_with_HoR_and_FMs`, `Are_we_missing_anything`, `Is_there_a_material_incremental_change_in_the_story`, and `Any_other_critical_question_to_be_covered` to be non-empty.
- Requires the current user's L1 comment: FM 1 → `FM_1_L1_Comment`, FM 2 → `FM_2_L1_Comment`, FM 3 → `FM_3_L1_Comment`, `zoho@enamamc.com` → `HoR_L1_Comment`.
- If any required field is empty, alerts "Please fill all the comments." and cancels the submit.

---

### 12. `FI_AB Mandate fields during L3 Approval`

- **Link name (file):** `FI_AB_Mandate_fields_duri5`
- **Workflow name:** `FI_AB Mandate fields during L3 Approval` (marked "Disabled" in comment, but the code body is active)
- **Trigger / Event:** On form submission (validation), when `Manual_Edit_Flag == false` and `Custom_Stage == "Submitted for L3 Review"`
- **GitHub:** [FI_AB_Mandate_fields_duri5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_AB_Mandate_fields_duri5.js)

**What it does**

L3-round comment validation (no section-level fields required here).

- Requires the current user's L3 comment: FM 1 → `FM_1_L3_Comment`, FM 2 → `FM_2_L3_Comment`, FM 3 → `FM_3_L3_Comment`, `zoho@enamamc.com` → `HoR_L3_Comment`.
- If empty, alerts "Please fill enter the comment." and cancels the submit.

---

### 13. `FI_PB Focus List Clarification Provided Email`

- **Link name (file):** `FI_PB_Focus_List_Clarific`
- **Workflow name:** `FI_PB Focus List Clarification Provided Email`
- **Trigger / Event:** On update of `Focus List Stage` (runs only when `Focus_List_In_Progress == true` and stage is "Clarification to CIO", "Clarification to FM 1", "Clarification to FM 2", or "Clarification to HoR")
- **GitHub:** [FI_PB_Focus_List_Clarific.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/FI_PB_Focus_List_Clarific.js)

**What it does**

The reverse of #6: when the analyst provides clarification back to an approver, notifies that approver.

- Reads the analyst's clarification text (`Analyst_Clarification`) from the matching stage subform and resolves the recipient: CIO → `User_Master[Profile == "CIO"]`; FM 1 → `User_Master[ID == FM_1_Name]`; FM 2 → `User_Master[ID == FM_2_Name]`; HoR → `User_Master[Profile == "Head of Research"]`.
- Sends "Clarification Provided – Focus List Submission for <Company>" with the analyst's clarification and an update link.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 14. `Hide Filed`

- **Link name (file):** `Hide_Filed`
- **Workflow name:** `Hide Filed`
- **Trigger / Event:** On load of the form (Created or Edited)
- **GitHub:** [Hide_Filed.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Hide_Filed.js)

**What it does**

Hides the deletion / removal-tracking fields from the form:

- Hides `Removed_List`, `Remove_Time_Detail`, `Remove_Time`, and `Removed_list_detail`.

---

### 15. `Mandate fields`

- **Link name (file):** `Mandate_fields2`
- **Workflow name:** `Mandate fields` (marked "Not required, handled in widget")
- **Trigger / Event:** On form submission (validation)
- **GitHub:** [Mandate_fields2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Mandate_fields2.js)

**What it does**

Entirely commented out — no active logic. It was intended to require conditional detail fields when certain toggles were set (e.g. ENAM Investment Philosophy = "Partial" requiring the non-compliance reason, "Any Other Information" = Yes requiring Additional Information, average-daily-volume amount fields). Now handled in the widget.

---

### 16. `Mandate fields`

- **Link name (file):** `Mandate_fields3`
- **Workflow name:** `Mandate fields` (marked "Not required")
- **Trigger / Event:** On form submission (validation)
- **GitHub:** [Mandate_fields3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Mandate_fields3.js)

**What it does**

Entirely commented out — no active logic. It was intended to require amount fields whenever the corresponding "Yes" toggle was set for market data (Marketing/Free-float Market Capitalization, Latest Price, 52-week High/Low dates, and 30-day / 3-month / 6-month average daily volumes).

---

### 17. `Send Email On L3 FM1 Status`

- **Link name (file):** `Send_Email_On_L3_FM1_Stat`
- **Workflow name:** `Send Email On L3 FM1 Status`
- **Trigger / Event:** On update of `L3 FM1 Status`
- **GitHub:** [Send_Email_On_L3_FM1_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_On_L3_FM1_Stat.js)

**What it does**

Handles the outcome of FM 1's L3-round review. This is one of the recurring "reviewer status" workflows (see #18–#29) that all share the same three-branch structure:

- **Rejected / Clarification Needed** → emails the analyst (`Analyst2.Email_Id`) an "Action Required" notice with a record link to the `Universe_Addition` page.
- **Re-Submit** → emails the fund manager (`L3_FM1_Name.Email_Id`) that the analyst has resubmitted for review.
- **All L3 FMs Approved** (`L3_FM1_Status`, `L3_FM2_Status`, `L3_FM3_Status` all "Approved") → emails the Head of Research (`User_Master[Profile == "Head of Research"]`) that the record awaits their approval.
- Each branch also sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 18. `Send Email On Status L2 FM2 Status`

- **Link name (file):** `Send_Email_On_Status_L2_F`
- **Workflow name:** `Send Email On Status L2 FM2 Status`
- **Trigger / Event:** On update of `L2 FM2 Status`
- **GitHub:** [Send_Email_On_Status_L2_F.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_On_Status_L2_F.js)

**What it does**

L2-round outcome for FM 2, same three-branch structure as #17.

- **Rejected / Clarification Needed** → analyst "Action Required".
- **Re-Submit** → FM 2 (`L2_FM2_Name.Email_Id`) resubmission notice.
- **All L2 FMs Approved** (`L2_FM1_Status1`, `L2_FM2_Status`, `L2_FM3_Status`) → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 19. `Send Email on FM1 Status`

- **Link name (file):** `Send_Email_on_FM1_Status`
- **Workflow name:** `Send Email on FM1 Status`
- **Trigger / Event:** On update of `FM1 Status`
- **GitHub:** [Send_Email_on_FM1_Status.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_FM1_Status.js)

**What it does**

First-round (L1) outcome for FM 1, same three-branch structure as #17.

- **Rejected / Clarification Needed** → analyst "Action Required".
- **Re-Submit** → FM 1 (`FM1_Name.Email_Id`) resubmission notice.
- **All FMs Approved** (`FM1_Status`, `FM2_Status`, `FM3_Status`) → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 20. `Send Email on FM2 Status`

- **Link name (file):** `Send_Email_on_FM2_Status`
- **Workflow name:** `Send Email on FM2 Status`
- **Trigger / Event:** On update of `FM2 Status`
- **GitHub:** [Send_Email_on_FM2_Status.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_FM2_Status.js)

**What it does**

First-round (L1) outcome for FM 2, same three-branch structure as #17.

- **Rejected / Clarification Needed** → analyst "Action Required".
- **Re-Submit** → FM 2 (`FM2_Name.Email_Id`) resubmission notice.
- **All FMs Approved** → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 21. `Send Email on L2 FM1 Status`

- **Link name (file):** `Send_Email_on_L2_FM1_Stat`
- **Workflow name:** `Send Email on L2 FM1 Status`
- **Trigger / Event:** On update of `L2 FM1 Status`
- **GitHub:** [Send_Email_on_L2_FM1_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM1_Stat.js)

**What it does**

L2-round outcome for FM 1, same three-branch structure as #17. Uses status field `L2_FM1_Status1`.

- **Rejected / Clarification Needed** → analyst "Action Required".
- **Re-Submit** → FM 1 (`L2_FM1_Name.Email_Id`) resubmission notice.
- **All L2 FMs Approved** → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 22. `Send Email on L2 FM3 Name`

- **Link name (file):** `Send_Email_on_L2_FM3_Name`
- **Workflow name:** `Send Email on L2 FM3 Name`
- **Trigger / Event:** On update of `L2 FM3 Name`
- **GitHub:** [Send_Email_on_L2_FM3_Name.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM3_Name.js)

**What it does**

When an L2 FM 3 reviewer is assigned, notifies them of a new submission to review.

- If `L2_FM3_Name` is set, emails that fund manager (`L2_FM3_Name.Email_Id`) a "New Submission for Review" notice naming the analyst and company, with a link to the `Universe_Addition` record.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 23. `Send Email on L2 FM3 Status`

- **Link name (file):** `Send_Email_on_L2_FM3_Stat`
- **Workflow name:** `Send Email on L2 FM3 Status`
- **Trigger / Event:** On update of `L2 FM3 Status`
- **GitHub:** [Send_Email_on_L2_FM3_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_FM3_Stat.js)

**What it does**

L2-round outcome for FM 3, same three-branch structure as #17.

- **Clarification Needed / Rejected** → analyst "Action Required".
- **Re-Submit** → FM 3 (`L2_FM3_Name.Email_Id`) resubmission notice.
- **All L2 FMs Approved** → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 24. `Send Email on L2 HoR Status`

- **Link name (file):** `Send_Email_on_L2_HoR_Stat`
- **Workflow name:** `Send Email on L2 HoR Status`
- **Trigger / Event:** On update of `L2 HoR Status`
- **GitHub:** [Send_Email_on_L2_HoR_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L2_HoR_Stat.js)

**What it does**

Handles the Head of Research decision in the L2 round.

- **Clarification Needed / Rejected / Approved** → emails the analyst an "Action Required" notice with a record link.
- **Re-Submit** → emails the Head of Research (`User_Master[Profile == "Head of Research"]`) a resubmission notice.
- Copies each to `parth@fristinetech.com`.

---

### 25. `Send Email on L3 FM2 Status`

- **Link name (file):** `Send_Email_on_L3_FM2_Stat`
- **Workflow name:** `Send Email on L3 FM2 Status`
- **Trigger / Event:** On update of `L3 FM2 Status`
- **GitHub:** [Send_Email_on_L3_FM2_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_FM2_Stat.js)

**What it does**

L3-round outcome for FM 2, same three-branch structure as #17.

- **Clarification Needed / Rejected** → analyst "Action Required".
- **Re-Submit** → FM 2 (`L3_FM2_Name.Email_Id`) resubmission notice.
- **All L3 FMs Approved** → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 26. `Send Email on L3 FM3 Status`

- **Link name (file):** `Send_Email_on_L3_FM3_Stat`
- **Workflow name:** `Send Email on L3 FM3 Status`
- **Trigger / Event:** On update of `L3 FM3 Status`
- **GitHub:** [Send_Email_on_L3_FM3_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_FM3_Stat.js)

**What it does**

L3-round outcome for FM 3, same three-branch structure as #17.

- **Clarification Needed / Rejected** → analyst "Action Required".
- **Re-Submit** → FM 3 (`L3_FM3_Name.Email_Id`) resubmission notice.
- **All L3 FMs Approved** → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 27. `Send Email on L3 HoR Status`

- **Link name (file):** `Send_Email_on_L3_HoR_Stat`
- **Workflow name:** `Send Email on L3 HoR Status`
- **Trigger / Event:** On update of `L3 HoR Status`
- **GitHub:** [Send_Email_on_L3_HoR_Stat.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_on_L3_HoR_Stat.js)

**What it does**

Head of Research decision in the L3 round (same structure as #24).

- **Clarification Needed / Rejected** → analyst "Action Required".
- **Re-Submit** → Head of Research (`User_Master[Profile == "Head of Research"]`) resubmission notice.
- Copies each to `parth@fristinetech.com`.

---

### 28. `Send Email to Analyst`

- **Link name (file):** `Send_Email_to_Analyst1`
- **Workflow name:** `Send Email to Analyst`
- **Trigger / Event:** On update of `FM 3 Status`
- **GitHub:** [Send_Email_to_Analyst1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_Analyst1.js)

**What it does**

First-round (L1) outcome for FM 3, same three-branch structure as #17.

- **Rejected / Clarification Needed** → analyst "Action Required".
- **Re-Submit** → FM 3 (`FM3_Name.Email_Id`) resubmission notice.
- **All FMs Approved** (`FM1_Status`, `FM2_Status`, `FM3_Status`) → Head of Research approval-required notice.
- Copies each to `parth@fristinetech.com`.

---

### 29. `Send Email to Hor`

- **Link name (file):** `Send_Email_to_Hor`
- **Workflow name:** `Send Email to Hor`
- **Trigger / Event:** On update of `HoR Status`
- **GitHub:** [Send_Email_to_Hor.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_Hor.js)

**What it does**

Head of Research decision in the first (L1) round (same structure as #24/#27).

- **Rejected / Clarification Needed / Approved** → analyst "Action Required".
- **Re-Submit** → Head of Research resubmission notice.
- Copies each to `parth@fristinetech.com`.

---

### 30. `Send Email to fm 3`

- **Link name (file):** `Send_Email_to_fm_3`
- **Workflow name:** `Send Email to fm 3`
- **Trigger / Event:** On update of `FM3 Name`
- **GitHub:** [Send_Email_to_fm_3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_fm_3.js)

**What it does**

When FM 3 is assigned in the first round, notifies them of a new submission (same pattern as #22).

- If `FM3_Name` is set, emails that fund manager (`FM3_Name.Email_Id`) a "New Submission for Review" notice naming the analyst and company, with a link to the `Universe_Addition` record.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 31. `Send Email to l3 Fm3`

- **Link name (file):** `Send_Email_to_l3_Fm3`
- **Workflow name:** `Send Email to l3 Fm3`
- **Trigger / Event:** On update of `L3 FM3 Name`
- **GitHub:** [Send_Email_to_l3_Fm3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_Email_to_l3_Fm3.js)

**What it does**

When the L3 FM 3 reviewer is assigned, notifies them of a new submission (same pattern as #22/#30).

- If `L3_FM3_Name` is set, emails that fund manager (`L3_FM3_Name.Email_Id`) a "New Submission for Review" notice, with a link to the `Universe_Addition` record.
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 32. `Send approval email to fm1`

- **Link name (file):** `Send_approval_email_to_fm`
- **Workflow name:** `Send approval email to fm1`
- **Trigger / Event:** On update of `FM1 Name`
- **GitHub:** [Send_approval_email_to_fm.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_fm.js)

**What it does**

When FM 1 is assigned in the first round, sends them the initial approval request (same "New Submission for Review" pattern as #22/#30/#31).

- If `FM1_Name` is set, emails that fund manager (`FM1_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 33. `Send approval email to fm2`

- **Link name (file):** `Send_approval_email_to_fm1`
- **Workflow name:** `Send approval email to fm2`
- **Trigger / Event:** On update of `FM2 Name`
- **GitHub:** [Send_approval_email_to_fm1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_fm1.js)

**What it does**

First-round approval request to FM 2 when assigned (same pattern as #32). Note the filename/workflow-name offset: the file `..._fm1` carries the FM2 workflow.

- If `FM2_Name` is set, emails that fund manager (`FM2_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 34. `Send approval email to l2 fm1`

- **Link name (file):** `Send_approval_email_to_l2`
- **Workflow name:** `Send approval email to l2 fm1`
- **Trigger / Event:** On update of `L2 FM1 Name`
- **GitHub:** [Send_approval_email_to_l2.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l2.js)

**What it does**

L2-round approval request to FM 1 when assigned (same pattern as #32).

- If `L2_FM1_Name` is set, emails that fund manager (`L2_FM1_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 35. `Send approval email to l2 fm2`

- **Link name (file):** `Send_approval_email_to_l3`
- **Workflow name:** `Send approval email to l2 fm2`
- **Trigger / Event:** On update of `L2 FM2 Name`
- **GitHub:** [Send_approval_email_to_l3.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l3.js)

**What it does**

L2-round approval request to FM 2 when assigned (same pattern as #32). Note the filename/label offset: file `..._l3` carries the L2 FM2 workflow.

- If `L2_FM2_Name` is set, emails that fund manager (`L2_FM2_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 36. `Send approval email to l3 fm1`

- **Link name (file):** `Send_approval_email_to_l4`
- **Workflow name:** `Send approval email to l3 fm1`
- **Trigger / Event:** On update of `L3 FM1 Name`
- **GitHub:** [Send_approval_email_to_l4.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l4.js)

**What it does**

L3-round approval request to FM 1 when assigned (same pattern as #32). Note the filename/label offset: file `..._l4` carries the L3 FM1 workflow.

- If `L3_FM1_Name` is set, emails that fund manager (`L3_FM1_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.

---

### 37. `Send approval email to l3 fm2`

- **Link name (file):** `Send_approval_email_to_l5`
- **Workflow name:** `Send approval email to l3 fm2`
- **Trigger / Event:** On update of `L3 FM2 Name`
- **GitHub:** [Send_approval_email_to_l5.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Company_Universe/Send_approval_email_to_l5.js)

**What it does**

L3-round approval request to FM 2 when assigned (same pattern as #32). Note the filename/label offset: file `..._l5` carries the L3 FM2 workflow.

- If `L3_FM2_Name` is set, emails that fund manager (`L3_FM2_Name.Email_Id`).
- Sends a "Copy - ..." to `parth@fristinetech.com`.
