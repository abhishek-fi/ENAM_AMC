// Company Universe - Edited - Validations on form submission - FI_AB Mandate fields during L2 Approval -- Disabled
if(input.Manual_Edit_Flag == false && Custom_Stage == "Submitted for L2 Review")
{
	filledFlag = true;
	if(Detailed_review_with_HoR_and_FMs1.isEmpty() || Are_we_missing_anything1.isEmpty() || Is_there_a_material_incremental_change_in_the_story1.isEmpty() || Any_other_critical_question_to_be_covered1.isEmpty())
	{
		filledFlag = false;
	}
	if(zoho.loginuserid == input.FM_1_Name.Email_Id && FM_1_L2_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_2_Name.Email_Id && FM_2_L2_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_3_Name.Email_Id && FM_3_L2_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == "zoho@enamamc.com" && HoR_L2_Comment.isEmpty())
	{
		filledFlag = false;
	}
	if(filledFlag == false)
	{
		alert "Please fill all the comments.";
		cancel submit;
	}
}
