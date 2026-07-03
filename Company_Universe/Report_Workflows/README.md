# Report Workflows — Company Universe Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** Company Universe · **Section:** Report Workflows

This folder holds the report-level action workflows (Zoho Creator report action items / buttons) for the Company Universe module. They fall into a few groups: deletion flows that pop open confirmation forms for removing companies from the universe or focus list; manual record-editing shortcuts that open a company record in edit mode; process-initiation flags that mark a company as being added to / removed from the universe or focus list; and openUrl launchers that open custom pages, widgets, and the One Pager creation flow for a selected company. Most of the flag/remove/manual-edit actions are marked "not in use", while the openUrl-based launchers (Add to Universe, Add to Focus List, Create One Pager, and the two deletion pop-ups) are the active ones.

## Summary

| # | Link name (file) | Workflow name | Report | Trigger | Status | GitHub |
|---|------------------|---------------|--------|---------|--------|--------|
| 1 | `Deletion` | Deletion | In My Companies Universe | On click of action item | In use | [Deletion.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Deletion.js) |
| 2 | `Deletion_From_Focus_List` | Deletion_From_Focus_List | In My Focus List | On click of action item: Deletion From Focus List | In use | [Deletion_From_Focus_List.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Deletion_From_Focus_List.js) |
| 3 | `Edit_records_manually_wit` | Edit records manually with edit url | In My Companies | On click of action item | Not in use | [Edit_records_manually_wit.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Edit_records_manually_wit.js) |
| 4 | `FI_AB_Edit_Record_Manuall` | FI_AB Edit Record Manually | In My Companies | On click of action item | Not in use | [FI_AB_Edit_Record_Manuall.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Edit_Record_Manuall.js) |
| 5 | `FI_AB_Remove_Focus_flow_s` | FI_AB Remove Focus flow start | In Focus List | On click of action item | Not in use | [FI_AB_Remove_Focus_flow_s.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Remove_Focus_flow_s.js) |
| 6 | `FI_AB_Remove_Universe_flo` | FI_AB Remove Universe flow start | In Universe Companies List | On click of action item: Remove From Universe | Not in use | [FI_AB_Remove_Universe_flo.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Remove_Universe_flo.js) |
| 7 | `Initiate_Focus_List_Proce` | Initiate Focus List Process | In Universe Companies List | On click of action item | Not in use | [Initiate_Focus_List_Proce.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Initiate_Focus_List_Proce.js) |
| 8 | `One_Pager_Widget_Link1` | One Pager Widget Link | In My Companies | On click of action item: Create One Pager | In use | [One_Pager_Widget_Link1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/One_Pager_Widget_Link1.js) |
| 9 | `Open_Focus_List_Addition_` | Open Focus List Addition Page | In My Companies Universe | On click of action item: Add to Focus List | In use | [Open_Focus_List_Addition_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Open_Focus_List_Addition_.js) |
| 10 | `open_Widget1` | open Widget | In All Companies | On click of action item: Add to Universe | In use | [open_Widget1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/open_Widget1.js) |

## Workflow Details

### 1. `Deletion`

- **Link name (file):** `Deletion`
- **Workflow name:** `Deletion`
- **Report:** In My Companies Universe
- **Trigger / Event:** On click of action item
- **GitHub:** [Deletion.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Deletion.js)

**What it does**

Opens the `Deletion_Focus_Master` form in a popup window, passing the selected record's ID via the `Record_ID` query parameter (`openUrl("#Form:Deletion_Focus_Master?Record_ID=" + input.ID, "popup window")`). The action itself performs no data changes; it hands off to the deletion form, which presumably handles the confirmation and removal.

---

### 2. `Deletion_From_Focus_List`

- **Link name (file):** `Deletion_From_Focus_List`
- **Workflow name:** `Deletion_From_Focus_List`
- **Report:** In My Focus List
- **Trigger / Event:** On click of action item: Deletion From Focus List
- **GitHub:** [Deletion_From_Focus_List.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Deletion_From_Focus_List.js)

**What it does**

Opens the `Deletion_from_focus_list` form in a popup window, passing the selected record's ID via the `Record_ID` query parameter (`openUrl("#Form:Deletion_from_focus_list?Record_ID=" + input.ID, "popup window")`). Like `Deletion`, it only launches the confirmation/removal form and performs no direct data change.

---

### 3. `Edit records manually with edit url`

- **Link name (file):** `Edit_records_manually_wit`
- **Workflow name:** `Edit records manually with edit url`
- **Report:** In My Companies
- **Trigger / Event:** On click of action item
- **Status:** Not in use
- **GitHub:** [Edit_records_manually_wit.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Edit_records_manually_wit.js)

**What it does**

Opens the built-in Zoho Creator record-edit URL for the selected company in a new window, targeting the `Company_Universe_Report` view of the `Company_Universe` app, and appends `Manual_Edit_Flag=true` as a query parameter (`openUrl("https://creatorapp.zoho.in" + zoho.appuri + "Company_Universe/record-edit/Company_Universe_Report/" + input.ID + "?Manual_Edit_Flag=true", "new window")`). The `Manual_Edit_Flag` presumably signals downstream form logic that this edit was manual. Marked not in use.

---

### 4. `FI_AB Edit Record Manually`

- **Link name (file):** `FI_AB_Edit_Record_Manuall`
- **Workflow name:** `FI_AB Edit Record Manually`
- **Report:** In My Companies
- **Trigger / Event:** On click of action item
- **Status:** Not in use
- **GitHub:** [FI_AB_Edit_Record_Manuall.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Edit_Record_Manuall.js)

**What it does**

Opens the `Company_Universe` form in a new window, passing the selected record via `recLinkID` and the source view via `viewLinkName=Company_Universe_Report` (`openUrl("#Form:Company_Universe?recLinkID=" + input.ID + "&viewLinkName=Company_Universe_Report", "new window")`). This is an alternative manual-edit entry point (opening the form directly rather than the record-edit URL used in workflow #3). Marked not in use.

---

### 5. `FI_AB Remove Focus flow start`

- **Link name (file):** `FI_AB_Remove_Focus_flow_s`
- **Workflow name:** `FI_AB Remove Focus flow start`
- **Report:** In Focus List
- **Trigger / Event:** On click of action item
- **Status:** Not in use
- **GitHub:** [FI_AB_Remove_Focus_flow_s.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Remove_Focus_flow_s.js)

**What it does**

Sets `input.Remove_From = "Focus";` — a single statement that seeds the `Remove_From` field/parameter with the value `"Focus"` to kick off a "remove from focus list" flow (the actual removal logic lives elsewhere, downstream of this flag). Marked not in use.

---

### 6. `FI_AB Remove Universe flow start`

- **Link name (file):** `FI_AB_Remove_Universe_flo`
- **Workflow name:** `FI_AB Remove Universe flow start`
- **Report:** In Universe Companies List
- **Trigger / Event:** On click of action item: Remove From Universe
- **Status:** Not in use
- **GitHub:** [FI_AB_Remove_Universe_flo.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/FI_AB_Remove_Universe_flo.js)

**What it does**

Sets `input.Remove_From = "Universe";` — the universe counterpart to workflow #5, seeding the `Remove_From` field/parameter with `"Universe"` to start a "remove from universe" flow. Marked not in use.

---

### 7. `Initiate Focus List Process`

- **Link name (file):** `Initiate_Focus_List_Proce`
- **Workflow name:** `Initiate Focus List Process`
- **Report:** In Universe Companies List
- **Trigger / Event:** On click of action item
- **Status:** Not in use
- **GitHub:** [Initiate_Focus_List_Proce.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Initiate_Focus_List_Proce.js)

**What it does**

Sets `input.Focus_List_In_Progress = true;` — flips the `Focus_List_In_Progress` flag to true to mark that the focus-list process has been started for the selected company (downstream logic acts on this flag). Marked not in use.

---

### 8. `One Pager Widget Link`

- **Link name (file):** `One_Pager_Widget_Link1`
- **Workflow name:** `One Pager Widget Link`
- **Report:** In My Companies
- **Trigger / Event:** On click of action item: Create One Pager
- **GitHub:** [One_Pager_Widget_Link1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/One_Pager_Widget_Link1.js)

**What it does**

Creates (or blocks duplicate creation of) a One Pager for the selected company for the current month:

1. Queries the `One_Page_Module` for a record where `Company_Name == input.ID` and `Added_Time` falls within the current month (`Added_Time >= zoho.currenttime.toStartOfMonth()` and `<= zoho.currenttime.eomonth(0)`).
2. If a matching record already exists (`onePagerData.ID != null`), it opens the `Stateless_Banner` form in a small popup (`height=190,width=390px`) — effectively a "One Pager already exists this month" notice. (The equivalent human-readable `info` message is present but commented out.)
3. Otherwise, it builds a URL to the `One_Pager` page with `create_new=true` plus the company's ID, name, and Bloomberg ticker (`input.CD_Bloomberg_Code`), URL-encoding the name and ticker via `encodeUrl`, and opens it in a new window with `successive=true`.

---

### 9. `Open Focus List Addition Page`

- **Link name (file):** `Open_Focus_List_Addition_`
- **Workflow name:** `Open Focus List Addition Page`
- **Report:** In My Companies Universe
- **Trigger / Event:** On click of action item: Add to Focus List
- **GitHub:** [Open_Focus_List_Addition_.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/Open_Focus_List_Addition_.js)

**What it does**

Opens the `Focus_List_Addition` page in a new window, passing the selected company's ID via the `companyId` query parameter (`openUrl("https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID, "new window")`). This is the "Add to Focus List" entry point.

---

### 10. `open Widget`

- **Link name (file):** `open_Widget1`
- **Workflow name:** `open Widget`
- **Report:** In All Companies
- **Trigger / Event:** On click of action item: Add to Universe
- **GitHub:** [open_Widget1.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/Company_Universe/Report_Workflows/open_Widget1.js)

**What it does**

Opens the `Universe_Addition` page in a new window, passing the selected company's ID via the `recid` query parameter (`openUrl("https://creatorapp.zoho.in" + zoho.appuri + "#Page:Universe_Addition?recid=" + input.ID, "new window")`). This is the "Add to Universe" entry point.

---
