# Validation Rules — Onboarding (Zoho CRM)

> **App:** ENAM AMC (Zoho CRM) · **Module:** Onboarding · **Section:** Validation Rules

These Zoho CRM Validation Rules enforce data quality on the **Onboardings** module (layout: *Individual and NRI*) before an onboarding record is saved. Both rules run on **Save Only**. One rule caps the **No. of Tranches** at 6 using a simple criteria-based check, while the other validates the **UPI** ID against a regex pattern via a Deluge function so that only well-formed UPI IDs (e.g. `name@bank`) are accepted. Together they prevent invalid tranche counts and malformed payment identifiers from entering the system.

## Summary

| # | Validation Rule | Applies On | Condition / Rule | Error Message | Links |
|---|-----------------|-----------|------------------|---------------|-------|
| 1 | Validation Rule for No. of Tranches | Save Only (create & edit) | `No. of Tranches > 6` (criteria-based; applies to all records) | No. of Tranches cannot be more than 6. | [screenshot](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20No.%20of%20Tranches/Validation%20Rule%20for%20No.%20of%20Tranches.png) |
| 2 | Validation Rule for UPI | Save Only (create & edit) | `UPI` field validated by function against regex `[a-zA-Z0-9._]{2,}@[a-zA-Z]{3,}` (empty allowed) | Invalid UPI ID format. Please enter a valid UPI (e.g., name@bank). | [code](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20UPI/UPI%20Regex%20Validation.js) · [screenshot](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20UPI/Validation%20Rule%20for%20UPI.png) |

## Validation Rule Details

### 1. Validation Rule for No. of Tranches

- **Module:** Onboarding (Onboardings — *Individual and NRI* layout)
- **Applies on:** Save Only (both record create and edit)
- **Condition:** Execute rule *When criteria is met* — validate using criteria on the **No. of Tranches** field: `No. of Tranches > 6`. The rule is applied for **all records**.
- **Error message:** `No. of Tranches cannot be more than 6.`
- **Screenshot:** [Validation Rule for No. of Tranches.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20No.%20of%20Tranches/Validation%20Rule%20for%20No.%20of%20Tranches.png)

**What it does**

This is a criteria-based validation rule (no Deluge function). When a user tries to save an Onboarding record, the rule checks whether the **No. of Tranches** value is greater than `6`. If it is, the save is blocked. The **Validation Preference** is set to **Stop with error** (as opposed to *Allow by alert*), so the record cannot be saved until the value is corrected. The error `No. of Tranches cannot be more than 6.` is displayed with **Error Location** set to **On primary field** (shown next to the No. of Tranches field rather than at the top of the page). In effect, the number of tranches is capped at a maximum of 6.

---

### 2. Validation Rule for UPI

- **Module:** Onboarding (Onboardings — *Individual and NRI* layout)
- **Applies on:** Save Only (both record create and edit)
- **Condition:** The **UPI** field is *validated using a function* — the Deluge function `UPI Regex Validation`. The function matches the UPI value against the regex `[a-zA-Z0-9._]{2,}@[a-zA-Z]{3,}`. Empty/blank UPI values are allowed (treated as valid).
- **Error message:** `Invalid UPI ID format. Please enter a valid UPI (e.g., name@bank).`
- **Function code:** [UPI Regex Validation.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20UPI/UPI%20Regex%20Validation.js)
- **Screenshot:** [Validation Rule for UPI.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Onboarding/Validation_Rules/Validation%20Rule%20for%20UPI/Validation%20Rule%20for%20UPI.png)

**What it does**

The screenshot shows a function-based validation: **WHEN** the **UPI** field is present, **Validate using function** → **UPI Regex Validation**. The Deluge function receives the CRM API request, converts it to a map, and reads the `record.UPI` field value. It then applies validation logic:

- **Empty allowed:** If `UPI` is `null` or blank (after trimming), the function returns `status = "success"` — so the UPI field is optional and an empty value passes.
- **Regex check:** Otherwise it tests the value against the pattern `[a-zA-Z0-9._]{2,}@[a-zA-Z]{3,}`:
  - `[a-zA-Z0-9._]{2,}` — the part before the `@` must be **at least 2 characters** of letters, digits, dots, or underscores.
  - `@` — a literal `@` separator.
  - `[a-zA-Z]{3,}` — the bank handle after `@` must be **at least 3 alphabetic characters** (letters only).
- If the value does **not** match, the function returns `status = "error"` with the message `Invalid UPI ID format. Please enter a valid UPI (e.g., name@bank).`, which blocks the save. If it matches, it returns `status = "success"` and the record saves.

This ensures any entered UPI ID follows the standard `handle@bank` shape (e.g. `name@bank`) while still permitting the field to be left blank.

> **Note:** The regex uses `matches()` in Deluge, which anchors the pattern to the full string, so the entire UPI value must conform (no leading/trailing extra characters). The bank-handle portion accepts only letters (`a-zA-Z`), so handles containing digits would be rejected by this pattern.
