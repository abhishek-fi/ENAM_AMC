// Company Universe - Edited - Update of Focus List Stage - FI_PB Focus List Clarification Provided Email
// Execute only if Focus_List_In_Progress == true && Focus_List_Stage == "Clarification to CIO" || Focus_List_Stage == "Clarification to FM 1" || Focus_List_Stage == "Clarification to FM 2" || Focus_List_Stage == "Clarification to HoR" 
updateLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
companyName = input.Company_Name;
analystName = input.Analyst2.First_Name + " " + input.Analyst2.Last_Name;
if(input.Focus_List_Stage == "Clarification to CIO")
{
	analystComments = "";
	for each  cio_r in input.Focus_List_CIO_Stage
	{
		analystComments = cio_r.Analyst_Clarification;
		userRec = User_Master[Profile == "CIO"];
		recipientEmail = userRec.Email_Id;
		recipientName = userRec.First_Name + " " + userRec.Last_Name;
	}
}
else if(input.Focus_List_Stage == "Clarification to FM 1")
{
	analystComments = "";
	for each  fm1_r in input.Focus_List_FM_1_Stage
	{
		analystComments = fm1_r.Analyst_Clarification;
		userRec = User_Master[ID == input.FM_1_Name];
		recipientEmail = userRec.Email_Id;
		recipientName = userRec.First_Name + " " + userRec.Last_Name;
	}
}
else if(input.Focus_List_Stage == "Clarification to FM 2")
{
	analystComments = "";
	for each  fm2_r in input.Focus_List_FM_2_Stage
	{
		analystComments = fm2_r.Analyst_Clarification;
		userRec = User_Master[ID == input.FM_2_Name];
		recipientEmail = userRec.Email_Id;
		recipientName = userRec.First_Name + " " + userRec.Last_Name;
	}
}
else if(input.Focus_List_Stage == "Clarification to HoR")
{
	analystComments = "";
	for each  hor_R in input.Focus_List_HoR_Stage
	{
		analystComments = hor_R.Analyst_Clarification;
		userRec = User_Master[Profile == "Head of Research"];
		recipientEmail = userRec.Email_Id;
		recipientName = userRec.First_Name + " " + userRec.Last_Name;
	}
}
subject = "Clarification Provided – Focus List Submission for " + companyName;
emailBody = "Dear " + recipientName + ",<br><br>" + analystName + " has provided clarification on the focus list submission for <b>" + companyName + "</b>. " + "Please review their comments and provide the necessary approval.<br><br>" + "<b>Clarification from Analyst:</b><br>" + analystComments.replaceAll("\n","<br>") + "<br><br>" + "Kindly review the provided clarifications at your earliest convenience.<br><br>" + "<b>Update Link:</b> <a href='" + updateLink + "' target='_blank'>Click here to update</a><br><br>" + "Regards,<br>" + "ENAM AMC Research Team";
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
	subject :"Copy - " + subject + "For " + recipientEmail
	message :emailBody
]
