# ENAM AMC — Zoho Application (Knowledge Transfer)

ENAM AMC is a Zoho application that supports the investment‑research and client‑onboarding workflows of the asset‑management business. Most of it is built on **Zoho Creator** (app `research-application-env`); the **Onboarding** module is built on **Zoho CRM**.

This repository is the **Knowledge‑Transfer (KT) reference** for the app. It documents every form workflow, standalone function, report workflow, schedule, CRM rule, and embedded widget, module by module.

## How this repository is organized

- Code is **Deluge**, saved with a `.js` extension for readability.
- A file's **name is the Zoho "link name"** (which can be truncated). The **actual workflow / function / schedule name** is on the **first line** of the code as a comment; standalone functions use their Deluge signature.
- Every section folder has a `README.md` documenting each item in it — its real name, trigger/configuration, a step‑by‑step explanation, and a link to the code.
- **Widgets** are shipped as the packed `.zip` downloaded from Zoho, next to a README describing the widget (purpose, data model, dependencies, and setup).
- A compiled master document, **`ENAM_AMC_KT.docx`**, combines all of these READMEs into one file for easy reading.

## Modules at a glance

| Module | Platform | What it covers |
|--------|----------|----------------|
| [Company Universe](#1-company-universe) | Zoho Creator | Tracking, evaluating and approving companies into the research universe and focus list |
| [Company Meeting](#2-company-meeting) | Zoho Creator | Scheduling and recording company meetings |
| [Morning Meeting](#3-morning-meeting) | Zoho Creator | The daily analyst morning‑meeting lifecycle — attendance, notes and reporting |
| [One Pager](#4-one-pager) | Zoho Creator | Building the single‑page (A4) company summary report |
| [Onboarding](#5-onboarding-zoho-crm) | Zoho CRM | Investor / client account‑opening (KYC) |

---

## Index

### 1. Company Universe

The master module for a company being tracked, evaluated and (eventually) added to the ENAM investment universe. It drives two multi‑stage approval processes — **Universe Addition** (Analyst → FM1/FM2/FM3 across levels L1/L2/L3 → Head of Research) and **Focus List Addition** (Analyst → CIO → FM1 → FM2 → Head of Research) — together with the master‑data imports that keep company and price data current.

- [Form Workflows](Company_Universe/Company_Universe/README.md) — field‑control rules and the status/field‑update email notifications that drive the approval flows.
- [Deletion From Focus List](Company_Universe/Deletion_From_Focus_List/README.md) — request form to remove a company from the Focus List; pre‑fills details and emails the CIO for approval.
- [Deletion from ENAM Coverage](Company_Universe/Deletion_from_ENAM_Coverage/README.md) — request form to drop a company from ENAM coverage; emails the Head of Research for approval.
- [Functions](Company_Universe/Functions/README.md) — chunked CSV import of Company Master and Price Master data.
- [Report Workflows](Company_Universe/Report_Workflows/README.md) — record‑level actions: deletion flows, manual record editing, focus‑list process initiation, and widget / one‑pager launchers.
- [Schedules](Company_Universe/Schedules/README.md) — CSV data import, daily Company/Price Master updates, and file cleanup.
- **Widgets**
  - [Add to Focus List](Company_Universe/Widgets/Add_to_Focus_List/README.md) — the CIO → FM1 → FM2 → HoR focus‑list approval workflow.
  - [Add to Universe](Company_Universe/Widgets/Add_to_Universe/README.md) — the three‑level (L1/L2/L3) ideation and coverage‑initiation approval workflow.

### 2. Company Meeting

Captures company‑meeting records — the meeting schedule, attendees, closing price and return/upside metrics, and cancellation handling.

- [Form Workflows](Company_Meeting/Company_Meeting/README.md) — the Company Meeting form: default values, company filtering, closing‑price fetch, return / upside‑downside calculation, field validations, and cancellation handling.
- [Company Contact Module](Company_Meeting/Company_Contact_Module/README.md) — sets the analyst field on the contact record.
- [Report Workflows](Company_Meeting/Report_Workflows/README.md) — open the meeting edit page from the meetings reports.

### 3. Morning Meeting

Automates the daily analyst **morning meeting** — creating the meeting, requesting and recording attendance, capturing analyst notes, rolling them up into a master record, and emailing the compiled notes PDF.

- [Meeting Details](Morning_Meeting/Meeting_Details/README.md) — access rules that make the meeting record and attendance subform read‑only.
- [Morning Meeting Attendance](Morning_Meeting/Morning_Meeting_Attendance/README.md) — captures each analyst's attendance response and mirrors it into the meeting record.
- [Morning Meeting Notes](Morning_Meeting/Morning_Meeting_Notes/README.md) — attendance + notes participation, conditional validations, and sync back to the meeting/master.
- [Morning Meeting Notes Master](Morning_Meeting/Morning_Meeting_Notes_Master/README.md) — the per‑meeting master rollup record.
- [Morning Notes](Morning_Meeting/Morning_Notes/README.md) — individual analyst notes keyed to a company or sector, with layout rules, access control and submission.
- [Meeting Notes Edit Request](Morning_Meeting/Meeting_Notes_Edit_Request/README.md) — the edit‑approval request form and its field rule.
- [Functions](Morning_Meeting/Functions/README.md) — the daily lifecycle: create the meeting, send reminders, collect attendance, roll up notes, and email the notes PDF.
- [Report Workflows](Morning_Meeting/Report_Workflows/README.md) — submit notes and the edit‑request approval loop.
- [Schedules](Morning_Meeting/Schedules/README.md) — the scheduled steps of the lifecycle (meeting creation, reminders, PDF export, housekeeping).
- **Widgets**
  - [Morning Meeting Notes Adder](Morning_Meeting/Widgets/Morning_Meeting_Notes_Adder/README.md) — rich‑text note capture (TinyMCE) with drafts, submit and attendance.

### 4. One Pager

Composes and manages the **single‑page (A4) company summary report**, then exports it to PDF.

- [Form Workflows (One Page Module)](One_Pager/One_Page_Module/README.md) — the one‑pager flag and field hide rules.
- [File Upload for One Pager](One_Pager/File_Upload_for_One_Pager/README.md) — uploads the price/valuation Excel files to WorkDrive.
- [Functions](One_Pager/Functions/README.md) — the PDF build pipeline: static HTML assembly, charts from Excel, PDF generation and combining, WorkDrive upload, and OAuth token helpers.
- [Report Workflows](One_Pager/Report_Workflows/README.md) — download / print / open the one‑pager and its widgets.
- [Schedules](One_Pager/Schedules/README.md) — the asynchronous pipeline (HTML → charts → combine → final PDF → reminders).
- **Widgets**
  - [One Pager](One_Pager/Widgets/One_Pager/README.md) — the compiled React A4 one‑pager editor / preview / PDF export.

### 5. Onboarding (Zoho CRM)

Investor / client **account‑opening (KYC)** built on Zoho CRM — capturing identity, contact, proof, income, banking, tax‑residency and investment‑profile data, and driving the verification workflow.

- [Workflow Rules](Onboarding/Workflow_Rules/README.md) — CRM automations: bank & PAN verification (Digio), tranche & STP task creation, owner/maker assignment, US‑citizen flagging, and IPV intimation emails.
- [Validation Rules](Onboarding/Validation_Rules/README.md) — the No. of Tranches cap and UPI‑ID format check.
- **Widgets**
  - [Onboarding Start](Onboarding/Widgets/Onboarding_Start/README.md) — the multi‑step KYC account‑opening form (Individual/NRI and Non‑Individual layouts).
