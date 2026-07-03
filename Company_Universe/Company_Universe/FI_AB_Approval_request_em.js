// Company Universe - Edited - Update of Focus List Stage - FI_AB Approval request email
// Execute only if Focus_List_In_Progress == true && Focus_List_Stage == "Submitted for Review" || Focus_List_Stage == "CIO Approved" || Focus_List_Stage == "FM 1 Approved" || Focus_List_Stage == "FM 2 Approved" 
approvalLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
companyName = input.Company_Name;
analystName = input.Analyst2.Full_Name;
submissionDate = zoho.currentdate;
if(input.Focus_List_Initiated_Time != null)
{
	submissionDate = input.Focus_List_Initiated_Time.toString("dd-MMM-yyy");
}
if(input.Focus_List_Stage == "Submitted for Review")
{
	userRec = User_Master[Profile == "CIO"];
	recipientEmail = userRec.Email_Id;
	recipientName = userRec.First_Name + " " + userRec.Last_Name;
}
else if(input.Focus_List_Stage == "CIO Approved")
{
	userRec = User_Master[ID == input.FM_1_Name];
	recipientEmail = userRec.Email_Id;
	recipientName = userRec.First_Name + " " + userRec.Last_Name;
}
else if(input.Focus_List_Stage == "FM 1 Approved")
{
	userRec = User_Master[ID == input.FM_2_Name];
	recipientEmail = userRec.Email_Id;
	recipientName = userRec.First_Name + " " + userRec.Last_Name;
}
else if(input.Focus_List_Stage == "FM 2 Approved")
{
	userRec = User_Master[Profile == "Head of Research"];
	recipientEmail = userRec.Email_Id;
	recipientName = userRec.First_Name + " " + userRec.Last_Name;
}
subject = "Focus List Submission Awaiting Your Approval – " + companyName;
emailBody = "Dear " + recipientName + ",<br><br>" + "A new focus list submission has been made and requires your approval. Please review the details below:<br><br>" + "<b>Company Name:</b> " + companyName + "<br>" + "<b>Submitted By:</b> " + analystName + "<br>" + "<b>Date of Submission:</b> " + submissionDate + "<br><br>" + "Kindly review and take the necessary action.<br><br>" + "<b>Approval Link:</b> <a href='" + approvalLink + "' target='_blank'>Click here to review</a><br><br>" + "Regards,<br>" + "ENAM AMC Research Team";
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
