// Company Universe - Edited - Update of HoR Status - Send Email to Hor
// Execute only if HoR_Status == "Rejected" || HoR_Status == "Clarification Needed" || HoR_Status == "Approved" 
analyst_name = input.Analyst2;
// info analyst_name ;
email = input.Analyst2.Email_Id;
// info email;
subject = "Universe Record - Action Required: " + input.Company_Name;
record_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Universe_Addition?recid=" + input.ID;
message = "Dear Analyst,<br><br>" + "Your Universe record requires your attention.<br><br>" + "Please review the record and take the necessary action using the link below:<br>" + "<a href='" + record_link + "' target='_blank'>Open Record</a><br><br>" + "Thank you for your prompt response.<br><br>" + "Regards,<br><b>ENAM Research Team</b>";
sendmail
[
	from :"rms@enamamc.com"
	to :email
	subject :subject
	message :message
]
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + subject
	message :message
]

// Execute only if HoR_Status == "Re-Submit" 
user_dt = User_Master[ID != 0 && Profile == "Head of Research"];
if(user_dt != null)
{
	name = user_dt.First_Name;
	email_id = user_dt.Email_Id;
	record_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Universe_Addition?recid=" + input.ID;
	subject = "Company Universe Record - Resubmission for Approval: " + input.Company_Name;
	message = "Dear Head od Reaserch ,<br><br>" + "The Analyst has <b>resubmitted</b> the Universe record with additional description.<br><br>" + "Kindly review the updated record using the link below:<br>" + "<a href='" + record_link + "' target='_blank'>Open Updated Record</a><br><br>" + "Thank you for your time and review.<br><br>" + "Regards,<br><b>ENAM Research Team</b>";
	sendmail
	[
		from :"rms@enamamc.com"
		to :email_id
		subject :subject
		message :message
	]
}
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + subject
	message :message
]

