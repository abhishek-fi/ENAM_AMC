// Meeting Notes Edit Request - In Meeting Notes Edit Request Report - On click of action item: Approve - meeting notes edit approve
edit_meeting_notes_request = Meeting_Notes_Edit_Request[ID == input.ID];
//popup_result = openUrl("https://creatorapp.zoho.in"+zoho.appuri+"/#Approval_Comment","same window");
//comment = popup_result;
noteRec = Morning_Notes[ID == input.Ref_Record];
noteRec.Edit_Access=true;
noteRec.Edit_Access_Date_Time=zoho.currenttime;
input.Approved = true;
input.Rejection = true;
if(edit_meeting_notes_request != null)
{
	analyst = edit_meeting_notes_request.Analyst_Name;
	full_name = analyst.First_Name + " " + analyst.Last_Name;
	email = analyst.Email_Id;
	morning_meeting_notes = Morning_Meeting_Notes[Analyst == input.Analyst_Name];
	// 	notes_update_Link = "https://creatorapp.zoho.in" + zoho.appuri + "#Report:My_Morning_Notes_Report?ID=" + input.Ref_Record;
	notes_update_Link = "https://creatorapp.zoho.in" + zoho.appuri + "Morning_Notes/record-edit/My_Morning_Notes_Report/" + input.Ref_Record;
	email_body = "Dear " + full_name + ",<br><br>";
	email_body = email_body + "Your meeting notes edit request has been approved by the Research Approver.<br><br>";
	//email_body = email_body + "Reason for approval: " + comment + "<br><br>";
	email_body = email_body + "Please <a href='" + notes_update_Link + "'>click here</a> to update your meeting notes.<br><br>";
	email_body = email_body + "Kindly make the necessary updates at your earliest convenience.<br><br>";
	email_body = email_body + "Best regards,<br><b>ENAM AMC Research Team</b>";
	sendmail
	[
		from :"rms@enamamc.com"
		to :email
		subject :"Meeting Notes Edit Request Approved – Action Required"
		message :email_body
	]
	info "Approval email sent to " + full_name;
}
else
{
	info "Meeting Notes Edit Request not found.";
}
