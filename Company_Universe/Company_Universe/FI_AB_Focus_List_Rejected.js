// Company Universe - Edited - Update of Focus List Stage - FI_AB Focus List Rejected notification
// Execute only if Focus_List_Stage == "Rejected by CIO" || Focus_List_Stage == "Rejected by FM 1" || Focus_List_Stage == "Rejected by FM 2" || Focus_List_Stage == "Rejected by HoR" 
viewLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
companyName = input.Company_Name;
// analystName = input.Analyst2.Full_Name;
rejectionDate = zoho.currentdate;
teamEmailList = List();
analystEmail = input.Analyst2.Email_Id;
teamEmailList.add(analystEmail);
horRec = User_Master[Profile == "Head of Research"];
horEmail = horRec.Email_Id;
cioRec = User_Master[Profile == "CIO"];
cioEmail = cioRec.Email_Id;
teamEmailList.add(cioEmail);
teamEmailList.add(horEmail);
teamEmailList.add(input.FM_1_Name.Email_Id);
teamEmailList.add(input.FM_2_Name.Email_Id);
if(input.Focus_List_Stage == "Rejected by CIO")
{
	rejectionComments = "";
	for each  cio_r in input.Focus_List_CIO_Stage
	{
		rejectionComments = cio_r.CIO_Comment;
	}
	approverName = "CIO";
}
else if(input.Focus_List_Stage == "Rejected by FM 1")
{
	rejectionComments = "";
	for each  fm1_r in input.Focus_List_FM_1_Stage
	{
		rejectionComments = fm1_r.FM_1_Comment;
	}
	approverName = "FM 1";
}
else if(input.Focus_List_Stage == "Rejected by FM 2")
{
	rejectionComments = "";
	for each  fm2_r in input.Focus_List_FM_2_Stage
	{
		rejectionComments = fm2_r.FM_2_Comment;
	}
	approverName = "FM 2";
}
else if(input.Focus_List_Stage == "Rejected by HoR")
{
	rejectionComments = "";
	for each  hor_R in input.Focus_List_HoR_Stage
	{
		rejectionComments = hor_R.HoR_Comment;
	}
	approverName = "HoR";
}
emailBody = "Dear Team,<br><br>" + "The focus list submission for <b>" + companyName + "</b> has been rejected by the approver. Please find the details below:<br><br>" + "<b>Rejected By:</b> " + approverName + "<br>" + "<b>Rejection Date:</b> " + rejectionDate + "<br>" + "<b>Reason for Rejection:</b><br>" + rejectionComments.replaceAll("\n","<br>") + "<br><br>" + "If any further action is required, please discuss it with the team.<br><br>" + "<b>View Details:</b> <a href='" + viewLink + "' target='_blank'>Click here to view</a><br><br>" + "Regards,<br>" + "ENAM AMC Research Team";
sendmail
[
	from :"rms@enamamc.com"
	to :teamEmailList
	subject :"Focus List Submission Rejected – " + companyName
	message :emailBody
]
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + emailBody + " -- " + teamEmailList
	message :emailBody
]
