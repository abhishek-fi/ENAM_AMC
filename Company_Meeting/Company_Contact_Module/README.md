# Form Workflows — Company Contact Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Meeting · **Form:** Company Contact Module

This folder contains the form-level workflows for the **Company Contact Module** form. The single workflow runs when the form loads (on create or edit) and auto-populates the **Analyst** field with the currently logged-in user, then locks that field for everyone except users with the **Analyst Admin** profile.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `Update_Analyst_Field1` | Update Analyst Field | On Load of form (Created or Edited) | [Update_Analyst_Field1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Contact_Module/Update_Analyst_Field1.js) |

## Workflow Details

### 1. `Update Analyst Field`

- **Link name (file):** `Update_Analyst_Field1`
- **Workflow name:** `Update Analyst Field`
- **Trigger / Event:** On Load of the form (when the form is Created or Edited)
- **GitHub:** [Update_Analyst_Field1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Meeting/Company_Contact_Module/Update_Analyst_Field1.js)

**What it does**

1. Reads the currently logged-in user's ID via `zoho.loginuserid`.
2. Looks up the matching record in the **User_Master** form by matching its `Email_Id` field against the logged-in user's ID.
3. Reads that user's `Profile` value into `analyst_profile`.
4. Pre-fills the form's **Analyst** field (`input.Analyst`) with the looked-up user's record ID, defaulting it to the current user.
5. If the user's profile is **not** `"Analyst Admin"`, the **Analyst** field is disabled so the user cannot change it. Users with the `Analyst Admin` profile keep the field editable (allowing them to assign a different analyst).
