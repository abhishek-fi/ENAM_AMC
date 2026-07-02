// Company Universe - Edited - Update of Focus List Stage - FI_AB Focus List Clarification Request email
// Execute only if Focus_List_In_Progress == true && Focus_List_Stage == "CIO Clarification Request" || Focus_List_Stage == "FM 1 Clarification Request" || Focus_List_Stage == "FM 2 Clarification Request" || Focus_List_Stage == "HoR Clarification Request" 
updateLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
companyName = input.Company_Name;
analystName = input.Analyst2.First_Name + " " + input.Analyst2.Last_Name;
recipientEmail = input.Analyst2.Email_Id;
if(input.Focus_List_Stage == "CIO Clarification Request")
{
	approverComments = "";
	for each  cio_r in input.Focus_List_CIO_Stage
	{
		approverComments = cio_r.CIO_Comment;
	}
}
else if(input.Focus_List_Stage == "FM 1 Clarification Request")
{
	approverComments = "";
	for each  fm1_r in input.Focus_List_FM_1_Stage
	{
		approverComments = fm1_r.FM_1_Comment;
	}
}
else if(input.Focus_List_Stage == "FM 2 Clarification Request")
{
	approverComments = "";
	for each  fm2_r in input.Focus_List_FM_2_Stage
	{
		approverComments = fm2_r.FM_2_Comment;
	}
}
else if(input.Focus_List_Stage == "HoR Clarification Request")
{
	approverComments = "";
	for each  hor_R in input.Focus_List_HoR_Stage
	{
		approverComments = hor_R.HoR_Comment;
	}
}
subject = "Clarification Requested – Focus List Submission for " + companyName;
emailBody = "Dear " + analystName + ",<br><br>" + "The approver has requested clarification on the focus list submission for <b>" + companyName + "</b>. " + "Please review their comments and provide the necessary updates.<br><br>" + "<b>Comments from Approver:</b><br>" + approverComments.replaceAll("\n","<br>") + "<br><br>" + "Kindly address the required clarifications at your earliest convenience.<br><br>" + "<b>Update Link:</b> <a href='" + updateLink + "' target='_blank'>Click here to update</a><br><br>" + "Regards,<br>" + "ENAM AMC Research Team";
sendmail
[
	from :"rms@enamamc.com"
	to :recipientEmail
	subject :subject
	message :emailBody
]
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + subject + "for " + recipientEmail
	message :emailBody
]
