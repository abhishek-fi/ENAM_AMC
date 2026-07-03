// Deletion from ENAM Coverage - Click of Submit - Send Email to CIO
baseURL = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Deleation_Email_Page/mCtCqDBrJN39u1YyQrzOaP8pR5QYbUVA2FO5wrJ0H1Y6QT3RKmr4PbXXumnjdUBsJ9k0Sa1Qa2h6tPWVhf4xnakRmtmvYRzp2VmZ?";
user_dt = User_Master[ID != 0 && Profile == "Head of Research"];
if(user_dt != null)
{
	name = user_dt.First_Name;
	email_id = user_dt.Email_Id;
	profile = user_dt.Profile;
	info email_id;
}
id = input.Record_ID;
company = input.Company_Name;
// company = Company_Universe[ID == input.Company_Name].Company_Name;
approve_link = baseURL + "RecordID=" + id + "&Status=Approve";
reject_link = baseURL + "RecordID=" + id + "&Status=Reject";
emailBody = "<html><body style='font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;'>";
emailBody = emailBody + "<p>Dear " + name + ",</p>";
emailBody = emailBody + "<p>An analyst has submitted a request for removing <b>" + company + "</b> from the ENAM Coverage and is awaiting your approval.</p>";
emailBody = emailBody + "<p>Please take the appropriate action using the options below.</p>";
emailBody = emailBody + "<br>";
emailBody = emailBody + "<div style='text-align:center;'>";
emailBody = emailBody + "<a href='" + approve_link + "' style='background-color:#28a745;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;'>Approve</a>";
emailBody = emailBody + "&nbsp;&nbsp;";
emailBody = emailBody + "<a href='" + reject_link + "' style='background-color:#dc3545;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;'>Reject</a>";
emailBody = emailBody + "</div>";
emailBody = emailBody + "<br><br>";
emailBody = emailBody + "<p>Thank you,<br><b>Research Operations Team</b></p>";
emailBody = emailBody + "</body></html>";
// ===== Send Email =====
sendmail
[
	from :"rms@enamamc.com"
	to :email_id
	subject :"Approval Request for Deletion "
	message :emailBody
]
openUrl("#Script:page.close ","Same window");
