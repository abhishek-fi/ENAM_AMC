# Form Workflows — One Page Module

> **App:** ENAM AMC (Zoho Creator) · **Module:** One Pager · **Form:** One Page Module

The **One Page Module** form captures a one-pager write-up composed of several content blocks, each of which can carry either written content or an image. Two workflows support this form: one runs on successful submission to flag the associated company record as having a one-pager for the current month, and the other runs on form load (for both new and existing records) to conditionally hide the block image/content fields based on the option selected for each block.

## Summary

| # | Link name (file) | Workflow name | Trigger / Event | GitHub |
|---|------------------|---------------|-----------------|--------|
| 1 | `FI_AB_one_pager_flag_in_c` | FI_AB one pager flag in company record | Created — On successful form submission | [FI_AB_one_pager_flag_in_c.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/One_Page_Module/FI_AB_one_pager_flag_in_c.js) |
| 2 | `Hide_Fields` | Hide Fields | Created or Edited — On load of the form | [Hide_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/One_Page_Module/Hide_Fields.js) |

## Workflow Details

### 1. `FI_AB one pager flag in company record`

- **Link name (file):** `FI_AB_one_pager_flag_in_c`
- **Workflow name:** `FI_AB one pager flag in company record`
- **Trigger / Event:** Created — On successful form submission
- **GitHub:** [FI_AB_one_pager_flag_in_c.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/One_Page_Module/FI_AB_one_pager_flag_in_c.js)

**What it does**

1. Fetches the `Company_Universe` record whose `ID` matches the `Company_Name` selected on the submitted One Page Module form (`Company_Name` holds the lookup ID).
2. Sets the field `Current_Month_One_Pager` on that company record to `true`, flagging that a one-pager exists for the company in the current month.

---

### 2. `Hide Fields`

- **Link name (file):** `Hide_Fields`
- **Workflow name:** `Hide Fields`
- **Trigger / Event:** Created or Edited — On load of the form
- **GitHub:** [Hide_Fields.js](https://github.com/abhishek-fi/ENAM_AMC/blob/main/One_Pager/One_Page_Module/Hide_Fields.js)

**What it does**

Controls the visibility of the image and written-content fields for three blocks (Block 5, Block 6, and Block 9) based on the option chosen for each block. For each block, the same pattern applies:

- If the block's `_Option` field is set to **"Written Content"**, the block's image field is hidden (the content field remains visible).
- If the block's `_Option` field is set to **"Image Upload"**, the block's content field is hidden (the image field remains visible).
- Otherwise (no valid option selected), both the image and content fields for that block are hidden.

Concretely:

1. **Block 6:** based on `Block_6_Option`, hides `Block_6_Image`, or `Block_6_Content`, or both.
2. **Block 5:** based on `Block_5_Option`, hides `Block_5_Image`, or `Block_5_Content`, or both.
3. **Block 9:** based on `Block_9_Option`, hides `Block_9_Image`, or `Block_9_Content`, or both.
