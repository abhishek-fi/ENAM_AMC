void send_first_meeting_nofication(int meetingD)
{
	attendances = Morning_Meeting_Attendance[Meeting_Detail == meetingD && Will_you_be_able_to_join_tomorrow == "" || Will_you_be_able_to_join_tomorrow == "Not Responded"];
	for each  att in attendances
	{
		analyst_record = att.Analyst_Name;
		if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile != "Fund Manager" && analyst_record.User_Status == "Active")
		{
			// 			updateLink = "https://creatorapp.zoho.in"+zoho.appuri+"#Form:Morning_Meeting_Attendance?recLinkID=" + att.ID.toString() + "&&viewLinkName=All_Morning_Meeting_Attendances";
			textID = att.ID.toString();
			baseUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Morning_Meetings_Attendance_Update/ke1JjMhtMXmdhSOs2fB52hjT1DZyfrW4P3nUfyuSzCxGJaSbOwV2P7waNUkjmsBtT6N0nQUTgmsAXBMNEfkFA1t89NQndERsVgbq";
			yesLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=offline";
			onlineLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=online";
			noLink = baseUrl + "?recID=" + textID + "&doesJoin=false&mode=none";
			//---
			info yesLink;
			emailBody = "<div style='margin:20px 0;'>";
			emailBody = emailBody + "<a href='" + yesLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attending In-person</a>&nbsp;&nbsp;";
			emailBody = emailBody + "<a href='" + onlineLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attend via Teams</a>&nbsp;&nbsp;";
			emailBody = emailBody + "<a href='" + noLink + "' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Not attending</a>&nbsp;&nbsp;";
			emailBody = emailBody + "</div>";
			buttons = emailBody;
			sendmail
			[
				from :"rms@enamamc.com"
				to :analyst_record.Email_Id
				subject :"First Intimation – Request for Tomorrow's Meeting Attendance Confirmation (" + tomorrow + " at 09:30 AM" + ")"
				message :"Dear " + analyst_record.First_Name + ",<br><br>" + "As part of our ongoing daily meetings, this is the first intimation to check your availability for tomorrow's meeting. " + "We kindly request you to confirm your attendance, so we can finalize the schedule and share the meeting invite accordingly.<br><br>" + "You are invited to attend the Analyst Meeting scheduled for <b>" + tomorrow + " at 09:30 AM" + "</b>.<br><br>" + "Please confirm your attendance for tomorrow's meeting.<br><br>" + "Your timely confirmation will help us ensure smooth coordination for the day.<br><br>" + "Looking forward to your response.<br>" + buttons + "<br>" + "Best regards,<br>ENAM AMC Research Team"
			]
		}
		att.Meeting_Invite_Response_Status=true;
	}
}
