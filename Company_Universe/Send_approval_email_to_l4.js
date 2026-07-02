// Company Universe - Edited - Update of L3 FM1 Name - Send approval email to l3 fm1
if(L3_FM1_Name != null)
{
	record_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Universe_Addition?recid=" + input.ID;
	subject = "Company Universe Record – New Submission for Review: " + input.Company_Name;
	message = "Dear Fund Manager,<br><br>" + input.Analyst2.First_Name + " " + input.Analyst2.Last_Name + " has submitted a request for adding <b>" + input.Company_Name + "</b> to ENAM Universe.<br><br>" + "Kindly review the submitted details and proceed with the necessary action using the link below:<br><br>" + "<a href='" + record_link + "' target='_blank'>Open Submitted Record</a><br><br>" + "Thank you for your time and review.<br><br>" + "Regards,<br><b>ENAM Research Team</b>";
	sendmail
	[
		from :"rms@enamamc.com"
		to :input.L3_FM1_Name.Email_Id
		subject :subject
		message :message
	]
}
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + subject + "for: " + input.L3_FM1_Name.Email_Id
	message :message
]
