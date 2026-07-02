string FI_AB_Attenedance_Email(int recID)
{
	rec = Morning_Meeting_Attendance[ID == recID];
	user = User_Master[ID == rec.Analyst_Name && User_Status == "Active"];
	if(user.count(ID) > 0)
	{
		name = user.First_Name;
		email = user.Email_Id;
		// 		email = "abhishek@fristinetech.com";
		textID = recID.toString();
		baseUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Morning_Meetings_Attendance_Update/ke1JjMhtMXmdhSOs2fB52hjT1DZyfrW4P3nUfyuSzCxGJaSbOwV2P7waNUkjmsBtT6N0nQUTgmsAXBMNEfkFA1t89NQndERsVgbq";
		yesLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=offline";
		onlineLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=online";
		noLink = baseUrl + "?recID=" + textID + "&doesJoin=false&mode=none";
		//---
		emailBody = "<html><body style='font-family:Arial;line-height:1.6;'>";
		emailBody = emailBody + "<p><b>Hello " + name + "</b></p>";
		emailBody = emailBody + "<p>You are requested to mark your morning meeting attendace.</p>";
		emailBody = emailBody + "<div style='margin:20px 0;'>";
		emailBody = emailBody + "<a href='" + yesLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attending In-person</a>&nbsp;&nbsp;";
		emailBody = emailBody + "<a href='" + onlineLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attend via Teams</a>&nbsp;&nbsp;";
		emailBody = emailBody + "<a href='" + noLink + "' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Not attending</a>&nbsp;&nbsp;";
		emailBody = emailBody + "</div>";
		emailBody = emailBody + "<br><p>Thank you,<br><b>Best Regards</b></p>";
		emailBody = emailBody + "</body></html>";
		// ---
		sendmail
		[
			from :"rms@enamamc.com"
			to :email
			subject :"Moning Meeting Attendance"
			message :emailBody
		]
		return "success";
	}
	return "failed";
}
