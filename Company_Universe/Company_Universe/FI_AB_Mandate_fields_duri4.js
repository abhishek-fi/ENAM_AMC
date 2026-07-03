// Company Universe - Edited - Validations on form submission - FI_AB Mandate fields during L1 Approval -- Disabled
if(input.Manual_Edit_Flag == false && Custom_Stage == "Submitted for L1 Review")
{
	info input.Manual_Edit_Flag;
	filledFlag = true;
	if(Detailed_review_with_HoR_and_FMs.isEmpty() || Are_we_missing_anything.isEmpty() || Is_there_a_material_incremental_change_in_the_story.isEmpty() || Any_other_critical_question_to_be_covered.isEmpty())
	{
		filledFlag = false;
	}
	if(zoho.loginuserid == input.FM_1_Name.Email_Id && FM_1_L1_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_2_Name.Email_Id && FM_2_L1_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_3_Name.Email_Id && FM_3_L1_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == "zoho@enamamc.com" && HoR_L1_Comment.isEmpty())
	{
		filledFlag = false;
	}
	if(filledFlag == false)
	{
		alert "Please fill all the comments.";
		cancel submit;
	}
}
