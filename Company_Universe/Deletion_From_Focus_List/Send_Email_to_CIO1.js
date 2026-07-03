// Deletion From Focus List - Click of Submit - Send Email to CIO
baseURL = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Deletion_Focus_List_Page/VdRBzGK7Tqm2NZYwsXQ8v399qgvOrRy26UxGVDAv2CnEvZtCQzxrVxzhCa80M62UprG7nqRN2GADNXGGHPp6RsFHZq3357hGzAbQ?";
user_dt = User_Master[ID != 0 && Profile == "CIO"];
if(user_dt != null)
{
	name = user_dt.First_Name;
	email_id = user_dt.Email_Id;
	profile = user_dt.Profile;
	// info email_id;
}
id = input.Record_ID;
approve_link = baseURL + "RecordID=" + id + "&Status=Approve";
reject_link = baseURL + "RecordID=" + id + "&Status=Reject";
emailBody = "<html><body style='font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;'>";
emailBody = emailBody + "<p>Dear " + name + ",</p>";
emailBody = emailBody + "<p>An analyst has submitted a <b>Company Universe Deletion Request</b> from the <b>Focus List</b> for your review.</p>";
emailBody = emailBody + "<p><b>Company Name:</b> " + input.Company_Name + "</p>";
emailBody = emailBody + "<p>Please review the request and take the appropriate action using the options below.</p>";
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
sendmail
[
	from :"rms@enamamc.com"
	to :"abhishek@fristinetech.com"
	subject :"Approval Request for Deletion "
	message :emailBody
]
openUrl("#Script:page.close ","Same window");
