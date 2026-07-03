// Meeting Notes Edit Request - In Meeting Notes Edit Request Report - On click of action item: Meeting notes edit rejection
edit_request_reject = Meeting_Notes_Edit_Request[ID == input.ID];
input.Rejection = true;
input.Approved = true;
if(edit_request_reject != null)
{
	analyst_name = edit_request_reject.Analyst_Name.First_Name + " " + edit_request_reject.Analyst_Name.Last_Name;
	email = edit_request_reject.Analyst_Name.Email_Id;
	// 	email_body = "Dear" + analyst_name;
	// 	email_body = "Your request is rejected beacuse of";
	email_body = "Dear " + analyst_name + ",<br><br>";
	email_body = email_body + "Unfortunately, your meeting notes edit request has been rejected by the Research Approver.<br><br>";
	email_body = email_body + "Please review the request and make the necessary changes as per the guidelines.<br><br>";
	email_body = email_body + "If you have any questions, kindly contact the Research Team.<br><br>";
	email_body = email_body + "Best regards,<br><b>ENAM AMC Research Team</b>";
	sendmail
	[
		from :"rms@enamamc.com"
		to :email
		subject :"Meeting Notes Edit Request Rejected"
		message :email_body
	]
}
else
{
	info "Meeting Notes Edit Request not found.";
}
