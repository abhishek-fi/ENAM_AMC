// Company Universe - Edited - Validations on form submission - FI_AB Mandate fields during L3 Approval -- Disabled
if(Manual_Edit_Flag == false && Custom_Stage == "Submitted for L3 Review")
{
	filledFlag = true;
	if(zoho.loginuserid == input.FM_1_Name.Email_Id && FM_1_L3_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_2_Name.Email_Id && FM_2_L3_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == input.FM_3_Name.Email_Id && FM_3_L3_Comment.isEmpty())
	{
		filledFlag = false;
	}
	else if(zoho.loginuserid == "zoho@enamamc.com" && HoR_L3_Comment.isEmpty())
	{
		filledFlag = false;
	}
	if(filledFlag == false)
	{
		alert "Please fill enter the comment.";
		cancel submit;
	}
}
