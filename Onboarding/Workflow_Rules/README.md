# Workflow Rules — Onboarding (Zoho CRM)

> **App:** ENAM AMC (Zoho CRM) · **Module:** Onboarding · **Section:** Workflow Rules

This section documents the seven Zoho **CRM Workflow Rules** that drive investor onboarding automation on the **Onboarding** module. They fire on record **Create** and/or **Edit** (or on specific field/status changes), evaluate CRM criteria, and then run **Instant Actions** — mostly Deluge **custom functions**, plus a couple of **Field Update** and **Email Notification** rules. Together they cover: **bank account verification** and **PAN (and PAN–Aadhaar seeding) verification** via the external **Digio** KYC API; automatic creation of **investment tranches** and their downstream **STP tasks**; assigning the record **Owner** as the **Maker** on submission; flagging **US-citizen** status from the first holder's citizenship; and sending **IPV (In-Person Verification) intimation emails** to the client, distributor, and RM/SRM when AML is verified. Note that the Digio Bank and PAN functions authenticate with a **Basic-auth token** in the `invokeurl` header (redacted in the repo) — this credential should be stored in a secure **Zoho connection / secret** rather than inline — and the functions have **minimal error handling**; see the anomalies noted per rule below.

## Summary

| # | Workflow Rule | Trigger | Criteria (brief) | Instant Action(s) | Links |
|---|---------------|---------|------------------|-------------------|-------|
| 1 | FI_AB Bank Account Verification | On Create; On Edit (FH_IFSC Code / FH_Account No. modified to not empty) | FH_Account No. IS NOT EMPTY AND FH_IFSC Code IS NOT EMPTY — `(1 and 2)` | Function: FI_AB Bank Verification - OB | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Verification%20-%20OB.js) · [On Create](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Account%20Verification%20-%20On%20Create.png) · [On Edit](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Account%20Verification%20-%20On%20Edit.png) |
| 2 | FI_AB Create STP Tasks | On Edit — Onboarding Status modified to `Corpus Validation` | Investment Preference IS `STP` | Function: FI_AB Create STP Taks | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20STP%20Tasks/FI_AB%20Create%20STP%20Task.js) · [rule](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20STP%20Tasks/FI_AB%20Create%20STP%20Tasks.png) |
| 3 | FI_AB Create Tranches | On Edit — No. of Tranches / Investment Amount / Initial Amount modified | Current Tranches Investment IS EMPTY OR = Rs. 0.00 — `(1 or 2)` | Function: FI_AB Create Tranches | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20Tranches/FI_AB%20Create%20Tranches.js) · [rule](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20Tranches/FI_AB%20Create%20Tranches.png) |
| 4 | FI_AB IPV related intimation email | On Edit — Onboarding Status modified to `AML Verified` | C1: Product ISN'T `EICE, EIDEA`; C2: Product IS `EICE, EIDEA` | Email Notifications (per condition) | [rule 1](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20IPV%20related%20intimation%20email/FI_AB%20IPV%20related%20intimation%20email%201.png) · [rule 2](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20IPV%20related%20intimation%20email/FI_AB%20IPV%20related%20intimation%20email%202.png) |
| 5 | FI_AB Update Owner as Maker | On Create (Maker IS EMPTY); On Edit — Onboarding Status modified to `Submitted` | On Create: Maker IS EMPTY. On Edit: Onboarding Status IS `Submitted` | Function: FI_AB Update Owner as Maker | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Update%20Owner%20as%20Maker.js) · [Assign Submitted Owner as Maker](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Assign%20Submitted%20Owner%20as%20Maker.png) · [Update Owner as Maker](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Update%20Owner%20as%20Maker.png) |
| 6 | FI_AB Update PAN Verification Status | On Create; On Edit (FH_PAN / SH_PAN / TH_PAN modified to not empty) | FH_PAN / SH_PAN / TH_PAN IS NOT EMPTY — `(( 1 or 2 ) or 3)` | Function: FI_AB Update Holders PAN Verification status | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20Holders%20PAN%20Verification%20status.js) · [On Create](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20PAN%20Verification%20Status%20-%20On%20Create.png) · [On Edit](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20PAN%20Verification%20Status%20-%20On%20Edit.png) |
| 7 | Update Is US Citizen based on Citizenship | On Create; On Edit — FH_Citizenship modified to any value | C1: FH_Citizenship IS EMPTY; C2: FH_Citizenship CONTAINS `United States`; C3: FH_Citizenship DOESN'T CONTAIN `United States` | Field Updates (Empty Is US Citizen / US Citizen / Not US Citizen) | [On Create 1](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20CREATE%201.png) · [On Create 2,3](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20CREATE%202%2C3.png) · [On Edit 1](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20EDIT%201.png) · [On Edit 2,3](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20EDIT%202%2C3.png) |

## Workflow Rule Details

### 1. FI_AB Bank Account Verification

- **Module:** Onboarding
- **Trigger:** Two variants. **On Create** — "executed when an onboarding is created". **On Edit** — "executed when **any** of the below fields are modified as mentioned below": FH_IFSC Code is modified to not empty, FH_Account No. is modified to not empty.
- **Criteria:** `FH_Account No. IS NOT EMPTY` (1) AND `FH_IFSC Code IS NOT EMPTY` (2), Criteria Pattern `(1 and 2)` — same on both variants.
- **Instant Action(s):** Function → **FI_AB Bank Verification - OB**.
- **Function code:** [FI_AB Bank Verification - OB.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Verification%20-%20OB.js)
- **Screenshots:** [FI_AB Bank Account Verification - On Create.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Account%20Verification%20-%20On%20Create.png) · [FI_AB Bank Account Verification - On Edit.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Bank%20Account%20Verification/FI_AB%20Bank%20Account%20Verification%20-%20On%20Edit.png)

**What it does**

The function `automation.FI_AB_Bank_Verification_OB(Int recId)` fetches the Onboarding record via `zoho.crm.getRecordById`, reads `Account_No`, `IFSC_Code`, and `Name` (used as beneficiary name). If both account number and IFSC are present, it builds a request map (`beneficiary_account_no`, `beneficiary_ifsc`, a `unique_request_id` from `zoho.currenttime.toLong()`, `beneficiary_name`, and `validation_mode = PENNY_LESS`) and calls the **Digio** bank-account verification API (`POST https://ext.digio.in:444/v4/client/verify/bank_account`) with a Basic-auth header. If the response `verified == true`, it updates the Onboarding record with `Bank_Details_Verified = true` and then calls the standalone function `standalone.FI_AB_Create_Bank_Account_Record(recId)` (defined elsewhere) to create the linked bank-account record. Otherwise it just logs `INVALID`.

- **Anomalies:** The Digio **Basic-auth token** is passed in the `invokeurl` header (redacted in the repo) and should be stored in a secure Zoho connection/secret rather than inline. No handling of API failure/non-200 responses, timeouts, or a `verified == false` case beyond an `info` log; on failure the record is silently left unverified.

---

### 2. FI_AB Create STP Tasks

- **Module:** Onboarding
- **Trigger:** On Edit — "executed when **Onboarding Status** is modified to the value **Corpus Validation**".
- **Criteria:** `Investment Preference IS STP` (single condition).
- **Instant Action(s):** Function → **FI_AB Create STP Taks** (spelled "Taks" in the rule UI; the underlying function is `FI_AB_Create_STP_Task`).
- **Function code:** [FI_AB Create STP Task.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20STP%20Tasks/FI_AB%20Create%20STP%20Task.js)
- **Screenshots:** [FI_AB Create STP Tasks.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20STP%20Tasks/FI_AB%20Create%20STP%20Tasks.png)

**What it does**

`automation.FI_AB_Create_STP_Task(Int recId)` fetches all related **Tranches** of the Onboarding record via `zoho.crm.getRelatedRecords("Tranches","Onboarding",recId)` and, for each tranche, creates a **Task** (`zoho.crm.createRecord("Tasks", ...)`) linked back to that tranche: `$se_module = Tranches`, `Owner` = tranche owner, `Subject` = tranche `Name`, `Due_Date` = tranche `Date`, and `What_Id` = tranche `id`. This turns each investment tranche into a follow-up task once the onboarding reaches Corpus Validation with an STP preference.

- **Anomalies:** No guard for an empty tranche list (harmless, loop just skips). No de-duplication, so re-running the rule (status re-set to Corpus Validation) could create duplicate tasks. Depends on tranches already existing (created by rule 3).

---

### 3. FI_AB Create Tranches

- **Module:** Onboarding
- **Trigger:** On Edit — "executed when **any** of the below fields are modified": No. of Tranches modified to a value `!= 0`; Investment Amount modified to a value `!= Rs. 0.00`; Investment Amount modified to not empty; No. of Tranches modified to not empty; Initial Amount modified to any value. Repeats whenever the modification happens.
- **Criteria:** `Current Tranches Investment IS EMPTY` (1) OR `Current Tranches Investment = Rs. 0.00` (2), Criteria Pattern `(1 or 2)`.
- **Instant Action(s):** Function → **FI_AB Create Tranches**.
- **Function code:** [FI_AB Create Tranches.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20Tranches/FI_AB%20Create%20Tranches.js)
- **Screenshots:** [FI_AB Create Tranches.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Create%20Tranches/FI_AB%20Create%20Tranches.png)

**What it does**

`automation.FI_AB_Create_Tranches(Int recordId)` fetches the Onboarding record and reads `Owner`, `No_of_Tranches`, `Investment_Amount`, `Systematic_Transfer_PlanDate`, and `Initial_Amount`. If an initial amount is set, it is subtracted from the investment amount before splitting. When there is at least one tranche and a positive remaining amount, it first checks `getRelatedRecords("Tranches", ...)` and **only proceeds if no tranches exist yet** (duplicate guard). It then does integer division to compute a `baseAmount` and a `remainder`, and creates up to six tranches (named "1st Tranche" … "6th Tranche") capped at `No_of_Tranches`. Each tranche is created via `zoho.crm.createRecord("Tranches", ...)` with `Applicant_Name = recordId` (the onboarding link), `Name`, `Owner`, an optional `Date` (plan date + N months, incrementing per tranche), and `Amount`. The `remainder` rupees are distributed one each to the first *remainder* tranches so the sum reconciles exactly to the investable amount.

- **Anomalies:** Tranche names are hard-coded to a maximum of **6**; a `No_of_Tranches > 6` would silently create only 6. Month increment uses `count` starting at 0 so the first tranche date equals the plan date and subsequent tranches step monthly — verify this matches business intent. Relies on the `Current Tranches Investment` rollup being empty/zero to avoid re-runs (belt-and-suspenders with the in-code existence check).

---

### 4. FI_AB IPV related intimation email

- **Module:** Onboarding
- **Trigger:** On Edit — "executed when **Onboarding Status** is modified to the value **AML Verified**".
- **Criteria:** Two conditions, each with its own action set. **Condition 1:** `Product ISN'T EICE, EIDEA`. **Condition 2:** `Product IS EICE, EIDEA`.
- **Instant Action(s):** Email Notifications (no custom function).
  - Condition 1 (non EICE/EIDEA products): **FI_AB IPV not required email to Client** and **FI_AB IPV not required email to RM/S…** (RM/SRM).
  - Condition 2 (EICE/EIDEA products): **FI_AB IPV Intimation to Distributor** and **IPV Intimation to RM/SRM**.
- **Function code:** *(none — email-notification rule)*
- **Screenshots:** [FI_AB IPV related intimation email 1.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20IPV%20related%20intimation%20email/FI_AB%20IPV%20related%20intimation%20email%201.png) · [FI_AB IPV related intimation email 2.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20IPV%20related%20intimation%20email/FI_AB%20IPV%20related%20intimation%20email%202.png)

**What it does**

When an onboarding is marked **AML Verified**, this rule sends IPV (In-Person Verification) intimation emails, branching on the **Product**. For products **other than** EICE/EIDEA (where IPV is not required), it emails the client and the RM/SRM that IPV is not required. For **EICE/EIDEA** products (IPV applicable), it sends IPV intimation emails to the distributor and to the RM/SRM. All actions are standard Zoho CRM Email Notification templates; there is no Deluge logic.

- **Anomalies:** None in logic; behaviour depends entirely on the referenced email templates and their recipient/field mappings, which are not in this repo.

---

### 5. FI_AB Update Owner as Maker

- **Module:** Onboarding
- **Trigger:** Two variants. **FI_AB Update Owner as Maker** — "executed when an onboarding is **created**". **FI_AB Assign Submitted Owner as Maker** — "executed when **Onboarding Status** is modified to the value **Submitted**".
- **Criteria:** On Create variant: `Maker IS EMPTY`. On Submit variant: `Onboarding Status IS Submitted`.
- **Instant Action(s):** Function → **FI_AB Update Owner as Maker** (both variants call the same function).
- **Function code:** [FI_AB Update Owner as Maker.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Update%20Owner%20as%20Maker.js)
- **Screenshots:** [FI_AB Assign Submitted Owner as Maker.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Assign%20Submitted%20Owner%20as%20Maker.png) · [FI_AB Update Owner as Maker.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20Owner%20as%20Maker/FI_AB%20Update%20Owner%20as%20Maker.png)

**What it does**

`automation.FI_AB_Update_Owner_as_Maker(Int recId)` fetches the Onboarding record, reads its `Owner`, and if the owner is present, updates the record setting `Maker = Owner` via `zoho.crm.updateRecord`. This stamps the current record owner as the "Maker" — on creation (when Maker is still empty) and again when the record is Submitted. If the owner cannot be fetched it logs "Owner fetching failled".

- **Anomalies:** Minor — misspelling "failled" in the log string; no functional issue. The two rules share one function, so both create-time and submit-time paths overwrite Maker with the current Owner.

---

### 6. FI_AB Update PAN Verification Status

- **Module:** Onboarding
- **Trigger:** Two variants. **On Create** — "executed when an onboarding is created". **On Edit** — "executed when **any** of the below fields are modified": FH_PAN modified to not empty, SH_PAN modified to not empty, TH_PAN modified to not empty (repeats on modification).
- **Criteria:** `FH_PAN IS NOT EMPTY` (1), `SH_PAN IS NOT EMPTY` (2), `TH_PAN IS NOT EMPTY` (3), Criteria Pattern `(( 1 or 2 ) or 3)` — same on both variants.
- **Instant Action(s):** Function → **FI_AB Update Holders PAN Verificati…** (`FI_AB_Update_Holders_PAN_Verification_status`).
- **Function code:** [FI_AB Update Holders PAN Verification status.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20Holders%20PAN%20Verification%20status.js)
- **Screenshots:** [FI_AB Update PAN Verification Status - On Create.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20PAN%20Verification%20Status%20-%20On%20Create.png) · [FI_AB Update PAN Verification Status - On Edit.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/FI_AB%20Update%20PAN%20Verification%20Status/FI_AB%20Update%20PAN%20Verification%20Status%20-%20On%20Edit.png)

**What it does**

`automation.FI_AB_Update_Holders_PAN_Verification_status(Int recordid)` verifies the PAN of up to three holders against the **Digio** KYC PAN API (`POST https://ext.digio.in:444/client/v4/apis/kyc/fetch_id_data/PAN`). It reads the record's `Layout` name to branch:

- **Non - Individual** layout: sends only `id_no` (the PAN) for the first holder; if the response `status == "VALID"` it sets `PAN_Verified = true`.
- **Individual** (else) layout: sends `name` (Name), `dob` (FH_Date_of_Birth formatted `dd/MM/yyy`), and `id_no`. If the returned `status` contains "valid", it sets `PAN_Verified = true`, and if `aadhaar_seeding_status == "y"` it also sets `PAN_Aadhaar_Seeding_Verified = true`.

It then repeats the individual-style call for the **second holder** (`PAN1` / `Name_of_Applicant1` / `FH_Date_of_Birth1`) setting `SH_PAN_Verified` / `SH_PAN_Aadhaar_Seeding_Verified`, and the **third holder** (`PAN2` / `Name_of_Applicant2` / `FH_Date_of_Birth2`) setting `TH_PAN_Verified` / `TH_PAN_Aadhaar_Seeding_Verified`. Finally, if any flags were collected, it writes them back with a single `zoho.crm.updateRecord("Onboarding", ...)`.

- **Anomalies:** Each Digio call uses a **hard-coded Basic-auth token** in the header; in this repo copy the tokens are **redacted (`xxxx…`)** — the live values live in Zoho and must not be committed. Note the tokens differ per holder block in the source (each is a distinct redacted string). Date format string is `"dd/MM/yyy"` (three `y`s — likely intended `yyyy`); verify Digio accepts it. The second/third-holder blocks do not check the record `Layout`, so they always use the individual (name+dob) request shape even on Non-Individual layouts. No handling of API errors/non-200 responses.

---

### 7. Update Is US Citizen based on Citizenship

- **Module:** Onboarding
- **Trigger:** Two variants. **On Create** — "executed when an onboarding is created". **On Edit** — "executed when **FH_Citizenship** is modified to any value" (repeats on modification).
- **Criteria:** Three conditions, each with its own Field Update action (identical on both Create and Edit variants):
  - **Condition 1:** `FH_Citizenship IS EMPTY`.
  - **Condition 2:** `FH_Citizenship CONTAINS United States`.
  - **Condition 3:** `FH_Citizenship DOESN'T CONTAIN United States`.
- **Instant Action(s):** Field Updates (no custom function):
  - Condition 1 → **Empty Is US Citizen** (clears the Is US Citizen field).
  - Condition 2 → **US Citizen** (sets Is US Citizen = yes/US Citizen).
  - Condition 3 → **Not US Citizen** (sets Is US Citizen = no).
- **Function code:** *(none — field-update rule)*
- **Screenshots:** [Update Is US Citizen based on Citizenship - ON CREATE 1.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20CREATE%201.png) · [Update Is US Citizen based on Citizenship - ON CREATE 2,3.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20CREATE%202%2C3.png) · [Update Is US Citizen based on Citizenship - ON EDIT 1.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20EDIT%201.png) · [Update Is US Citizen based on Citizenship - ON EDIT 2,3.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Workflow_Rules/Update%20Is%20US%20Citizen%20based%20on%20Citizenship/Update%20Is%20US%20Citizen%20based%20on%20Citizenship%20-%20ON%20EDIT%202%2C3.png)

**What it does**

This rule keeps the **Is US Citizen** flag in sync with the first holder's citizenship (**FH_Citizenship**), both when the record is created and whenever FH_Citizenship changes. If citizenship is empty it clears the flag; if it contains "United States" it sets the holder as a US Citizen; otherwise it marks them Not US Citizen. Implemented entirely with CRM **Field Update** actions — no Deluge.

- **Anomalies:** The `CONTAINS United States` match is a substring test on the citizenship text, so any value literally containing that phrase is treated as US; confirm the FH_Citizenship picklist/values align with this. Only the **first holder's** citizenship drives the flag — joint/second/third holders are not considered here.

---
