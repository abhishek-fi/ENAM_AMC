// Morning Meeting Notes - In Morning Meeting Notes Report - On click of action item: Raise Edit Request - approval for meeting notes edit -- Not in use
meeting_note = Morning_Meeting_Notes[ID == input.ID];
input.Raised_Request = true;
for each  note in meeting_note
{
	meeting_note_edit_request = insert into Meeting_Notes_Edit_Request
	[
		Added_User=zoho.loginuser
		Analyst_Name=note.Analyst
		Company_Name=note.Morning_Notes.Company_Name
		Edit_Request_Raise_Time=zoho.currenttime
		Meeting_Notes=note.Morning_Notes.Meet_Note
	];
	//edit_note = Meeting_Notes_Edit_Request[Analyst_Name == input.Analyst];
	edit_note = Meeting_Notes_Edit_Request[Analyst_Name == input.Analyst];
	info edit_note.ID;
	research_head_email = User_Master[Profile == "Head of Research" && User_Status == "Active"].Email_Id;
	analyst_name = note.Analyst.First_Name + " " + note.Analyst.Last_Name;
	company_name = note.Morning_Notes.Company_Name.Company_Name;
	meeting_note_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Report:Meeting_Notes_Edit_Request_Report?ID=" + edit_note.ID;
	//meeting_note_link = "https://creatorapp.zoho.in"+zoho.appuri+"#Report:Meeting_Notes_Edit_Request_Report?recLinkID=" +edit_note.ID.toString()+ "&viewLinkName=Meeting_Notes_Edit_Request_Report";
	// Compose the email body
	email_body = "Dear Research Head,<br><br>";
	email_body = email_body + "An edit request has been raised for the following meeting notes.<br><br>";
	email_body = email_body + "<b>Analyst Name:</b> " + analyst_name + "<br>";
	email_body = email_body + "<b>Company Name:</b> " + company_name + "<br>";
	email_body = email_body + "<b>Meeting Notes:</b><br>" + meeting_note.Morning_Notes.Meet_Note + "<br><br>";
	email_body = email_body + "To review and approve, please click the following link to view the meeting notes record: <a href='" + meeting_note_link + "'>View Record</a><br><br>";
	email_body = email_body + "Best regards,<br>ENAM AMC Research Team";
	sendmail
	[
		from :"rms@enamamc.com"
		to :research_head_email
		subject :"Meeting Notes Edit Request Raised"
		message :email_body
	]
	info "Email sent to Research Head";
}
