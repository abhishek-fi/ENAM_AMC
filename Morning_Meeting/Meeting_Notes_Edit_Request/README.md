# Form Workflows — Meeting Notes Edit Request

> **App:** ENAM AMC (Zoho Creator) · **Module:** Morning Meeting · **Form:** Meeting Notes Edit Request

This form is the request-capture step in the meeting-notes edit-approval loop. When a user opens it, one script workflow immediately locks the form down for read-only viewing — it raises an access alert and disables every field (Meeting Notes, Company Name, Approved, Edit Request Raise Time, Analyst Name, Approve Comment, Rejection and Meet Note) so the record cannot be created or altered from this entry point. A second script workflow seeds sensible defaults on load, initialising both the `Approved` and `Rejection` decision flags to `false` so a freshly loaded request starts in a neutral, undecided state. Alongside the scripts, a no-code **Field rule** ("Hide field") hides the `Approved`, `Rejection` and `Meeting_Notes` fields from view on load. Together they present the form as a controlled, view-only capture of an edit request whose approval/rejection state is managed downstream rather than edited directly here.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `View_only_the_Meeting_Not` | View only the Meeting Notes Edit Request Form | Created or Edited · On load of the form | [View_only_the_Meeting_Not.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/View_only_the_Meeting_Not.js) |
| 2 | `default_values` | default values | Created or Edited · On load of the form | [default_values.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/default_values.js) |
| 3 | `Hide_field` (screenshot) | Hide field | Created or Edited · Field rule (form load & field input) | [Hide_field.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/Hide_field.png) |

## Workflow Details

### 1. `View only the Meeting Notes Edit Request Form`

- **Link name (file):** `View_only_the_Meeting_Not`
- **Workflow name:** `View only the Meeting Notes Edit Request Form`
- **Trigger / Event:** Created or Edited — on load of the form
- **GitHub:** [View_only_the_Meeting_Not.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/View_only_the_Meeting_Not.js)

**What it does**

Makes the form entirely read-only when it loads, so users can view an edit request but cannot create or change it here.

1. Shows an alert to the user: `"You do not have access to create record"`.
2. Disables every field on the form so none can be edited:
   - `Meeting_Notes`
   - `Company_Name`
   - `Approved`
   - `Edit_Request_Raise_Time`
   - `Analyst_Name`
   - `Approve_Comment`
   - `Rejection`
   - `Meet_Note`

---

### 2. `default values`

- **Link name (file):** `default_values`
- **Workflow name:** `default values`
- **Trigger / Event:** Created or Edited — on load of the form
- **GitHub:** [default_values.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/default_values.js)

**What it does**

Initialises the two decision flags to a neutral, undecided state when the form loads.

1. Sets `input.Approved = false`.
2. Sets `input.Rejection = false`.

This ensures a newly loaded edit request is neither approved nor rejected until acted on downstream.

---

## Field Rule Workflows (no-code configuration)

These workflows are built with Zoho Creator's built-in **Field rules** (no Deluge script). Their actions execute on form load and whenever a field participating in a condition is changed by the user. The linked screenshot captures the exact configuration.

### 3. `Hide field`

- **Link name (file):** `Hide_field` (screenshot)
- **Workflow name:** `Hide field`
- **Type:** Field rule — configured via Zoho Creator (no code)
- **Trigger / Event:** Created or Edited — on form load and on user input of participating fields
- **Screenshot:** [Hide_field.png](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Morning_Meeting/Meeting_Notes_Edit_Request/Hide_field.png)

**What it does**

The rule contains two action blocks, both configured to **Execute without condition** (they always run):

1. **Execute without condition** → **Hide fields** `[Approved, Rejection]` — hides the `Approved` and `Rejection` fields from the form.
2. **Execute without condition** → **Hide fields** `[Meeting_Notes]` — hides the `Meeting_Notes` field from the form.

The net effect is that the `Approved`, `Rejection` and `Meeting_Notes` fields are always hidden on this form, regardless of any field values.
