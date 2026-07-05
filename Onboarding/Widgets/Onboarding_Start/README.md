# Onboarding — Widget Documentation

> **Platform:** Zoho **CRM** widget (embedded app) — *not* Zoho Creator
> **CRM Module:** `Onboarding` (custom module)
> **Entry files:** `app/widget.html`, `app/widget.css`

---

## 1. Purpose

The **Onboarding** widget is a **multi-step client account-opening / investor-profile form** embedded in Zoho CRM. It captures full KYC information — identity, contact, proof of identity & address, income, banking, tax residency and investment profile — and supports saving a draft and submitting the completed record.

It handles **two entity types**, chosen automatically by CRM **layout**:

| Layout | Layout ID | Form shape |
|--------|-----------|-----------|
| **Individual / NRI** | `832485000000688002` | 4-step wizard (First Holder, Second Holder, Third Holder, Investment) |
| **Non-Individual** (company/partnership/trust) | `832485000000902277` | Single form + Promoter and UBO subforms |

---

## 2. Where It Runs & What It Touches

| Item | Value |
|------|-------|
| **Platform** | Zoho CRM embedded widget |
| **Module** | `Onboarding` (custom) |
| **SDK** | Zoho CRM JS SDK **v1.2** (`ZohoEmbededAppSDK.min.js`) |
| **API datacenter** | `https://www.zohoapis.in` (India — change if on another DC) |
| **CRM connection** | Named `crm` (used for REST v8 calls) |

**How the record is identified:** on `PageLoad` the widget calls `ZOHO.CRM.UI.Record.getSelectedRecords()` for the current record ID and `ZOHO.CRM.UI.Page.getPageInfo()` to detect the layout. If no layout is detected it defaults to Individual/NRI.

### CRM APIs used
`ZOHO.CRM.API.getRecord`, `insertRecord`, `updateRecord`, `uploadFile`, `getFile`; `ZOHO.CRM.CONNECTION.invoke` (REST v8 PUT/GET for photo & subform fields); `ZOHO.CRM.UI.Resize`, `UI.Page.getPageInfo`, `UI.Record.getSelectedRecords`, `UI.Popup.close`; `ZOHO.embeddedApp.on("PageLoad")` / `.init()`.

---

## 3. User Roles & Permissions

Roles are not defined in the widget; it relies on CRM's own module permissions. The widget needs **create / read / update** on the `Onboarding` module plus file upload/download. The `Onboarding_Status` field carries the downstream review workflow (see below), implying KYC/Checker/Approver roles handle status progression in CRM.

---

## 4. Workflow

1. **Load** → SDK init → detect current record & layout → load existing data (edit mode) → render steps (Individual) or single form (Non-Individual).
2. **Fill** the form. Individual/NRI is a 4-step wizard; Non-Individual is one page with dynamic Promoter/UBO rows.
3. **Save as Draft** → writes the record with `Onboarding_Status = "Draft"`; photos applied via REST v8 PUT.
4. **Submit** → validates all steps, uploads photos & subforms, sets status to `"Submitted"`, then redirects to the CRM record and closes the widget.

**Individual/NRI steps:** *First Holder → Second Holder → Third Holder → Investment.* Each holder step covers Identity, Contact, Proof of Identity, Proof of Address, Income, Bank, and Tax Residency. Second/Third holder sections appear conditionally (triggered by entering a name).

**Non-Individual:** entity details + **Promoter subform** (`Details_of_Promoters_Su`: Sr. No, PAN, Name, DIN/UID, Address, Relationship, PEP, Photo) + **UBO subform** (`Ultimate_Beneficial_Owner_Details_Su`: Name, DOB, PAN, Nationality, % Holding).

**Status values** (Non-Individual pipeline): Draft, Detailed Documentation, KYC Verifying, AML Verifying, Checker Verifying, Penny Pay Verifying, Demat Verifying, Document Scanned, Welcome Kit Shared, Onboarding Completed.

---

## 5. Key Features & UI

- **Step wizard** (Individual): clickable step indicators, progress bar, Previous/Next, Save as Draft (always), Submit (last step), and a status badge.
- **Grouped sections** with headers; 3-column desktop table layout, single column on mobile.
- **Country picker** (~200 countries), date picker via **Flatpickr**, dd/mm/yyyy enforced.
- **Photo fields** for each holder with in-browser preview, upload, and delete.
- **Dynamic subform grids** (Non-Individual) with add/remove rows and auto-incrementing Sr. No.
- **Conditional logic:** second/third holder reveal by name; minor detection by DOB (< 18) reveals "Relationship with Minor"; "permanent address same as correspondence" auto-fills; "Others" options generate a free-text input; proof fields for later holders can be locked from the first holder (`.proof-locked`).
- **Validation:** email pattern, dd/mm/yyyy dates, required fields, numeric-only (pincode/Aadhaar), blocked exponent/sign chars in number fields, image type (JPG/PNG/GIF) & 2 MB size limit.

---

## 6. Data Model (selected API field names)

**Individual/NRI — First Holder (subsequent holders mirror with suffixes):**
`Name`, `Father_s_Spouse_s_name`, `Mother_s_Name`, `FH_Date_of_Birth`, `Marital_Status`, `Gender`, `Citizenship`, `Residential_Status`, `FH_Type_of_Account`; income: `Net_worth_Not_older_than_1_year`, `As_on_Date`, `Income_Range_per_annum`, `Occupation`, `Sources_of_Funds`; contact: `Mobile_No`, `Email_ID`, `Landline_No`; proof: `PAN_Card`, `UID_Aadhaar`, `Passport_Number`, `Passport_Expiry_Date`, `Driving_License`, `Proof_of_Address`, `Address_for_Correspondence_Local_Address_in_case`, `Pincode`, `Country`, `City_Town_Village`, `State`, `Permanent_Address_Same_as_Correspondence_Address`; bank: `Bank_Name`, `IFSC_Code`, `Account_No`, `Account_Type`, `Branch`; investment: `Risk_Tolerance_for_Investment`, `Overall_Investment_Goals`, `Preferred_Asset_Class`. Second/third holders use `Name_of_Applicant1`/`Name_of_Applicant2` and `_1`/`_2`-suffixed variants.

**Non-Individual:** `Name_of_Company_Partnership_Trust`, `PAN`, `TAN`, `Registration_No_e_g_CIN`, `GST_No`, `Date_of_Commencement_of_Business`, `Nature_of_Business_Occupation_NI`, `Type_of_Company_Firm_NI`, `Registered_Address_Same_as_Correspondence_Address`.

**Photos (both layouts):** `Photo_of_First_Holder`, `Photo_of_Second_Holder`, `Photo_of_Third_Holder` — written via REST v8 PUT with `File_Id__s`.

**Status:** `Onboarding_Status`.

---

## 7. Dependencies

| Dependency | Source |
|------------|--------|
| Zoho CRM JS SDK 1.2 | `https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js` (CDN) |
| Flatpickr (date picker) | `https://cdn.jsdelivr.net/npm/flatpickr/...` (CDN) |

`app/widget.css` holds all styling. `translations/en.json` is present but empty.

---

## 8. Setup / Deployment Notes

1. Create the `Onboarding` custom module with all fields above, the three photo file fields, and the two subforms (`Details_of_Promoters_Su`, `Ultimate_Beneficial_Owner_Details_Su`).
2. Create the **two layouts** with the exact IDs referenced in code (`832485000000688002` Individual/NRI, `832485000000902277` Non-Individual) — or update the IDs in the code to match your org's layouts.
3. Create a CRM **connection named `crm`** with scope to update the module (required for the REST v8 photo/subform writes).
4. Confirm the **API datacenter** — code uses `https://www.zohoapis.in`; change for `.com`/`.eu`/etc.
5. Register the widget in **CRM → Setup → Widgets** and attach it to the `Onboarding` module (button / related list / web tab). Host `widget.html`, `widget.css`, `translations/en.json`.
