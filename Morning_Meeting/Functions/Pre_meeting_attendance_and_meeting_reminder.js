void Pre_meeting_attendance_and_meeting_reminder(int meetingId)
{
	attRecs = Morning_Meeting_Attendance[Meeting_Detail == meetingId];
	for each  att in attRecs
	{
		if(att.Will_you_be_able_to_join_tomorrow == null || att.Will_you_be_able_to_join_tomorrow == "")
		{
			analyst_record = att.Analyst_Name;
			if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile != "Fund Manager" && analyst_record.Profile != "Head of Research" && analyst_record.User_Status == "Active")
			{
				textID = att.ID.toString();
				baseUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Morning_Meetings_Attendance_Update/ke1JjMhtMXmdhSOs2fB52hjT1DZyfrW4P3nUfyuSzCxGJaSbOwV2P7waNUkjmsBtT6N0nQUTgmsAXBMNEfkFA1t89NQndERsVgbq";
				yesLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=offline";
				onlineLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=online";
				noLink = baseUrl + "?recID=" + textID + "&doesJoin=false&mode=none";
				emailBody = "<div style='margin:20px 0;'>";
				emailBody = emailBody + "<a href='" + yesLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attending In-person</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + onlineLink + "' style='background-color:#1a73e8;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attend via Teams</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + noLink + "' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Not attending</a>&nbsp;&nbsp;";
				emailBody = emailBody + "</div>";
				buttons = emailBody;
				sendmail
				[
					from :"rms@enamamc.com"
					to :analyst_record.Email_Id
					subject :"Morning Meeting Reminder – " + today.toString("dd-MMM-yyyy")
					message :"Dear " + analyst_record.First_Name + ",<br><br>" + "Hope you are doing well. This is a gentle reminder that the <b>Morning Meeting</b> is scheduled for <b>today at 9:30 AM</b>.<br><br>" + "We also noticed that your attendance for today's meeting has not been marked yet. Kindly update your response at the earliest using the options below:<br>" + buttons + "<b>Please respond before 9:30 AM on " + today.toString("dd-MMM-yyyy") + ".</b><br><br>" + "Regards,<br>ENAM AMC Research Team"
				]
				att.Reminder_3=true;
			}
		}
		else if(att.Will_you_be_able_to_join_tomorrow == "Yes")
		{
			analyst_record = att.Analyst_Name;
			if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile != "Fund Manager" && analyst_record.Profile != "Head of Research")
			{
				meeting_date = today.toString("dd-MMM-yyyy");
				sendmail
				[
					from :"rms@enamamc.com"
					to :analyst_record.Email_Id
					subject :"Reminder : Morning Meeting Today – " + meeting_date
					message :"Dear " + analyst_record.First_Name + ",<br><br>" + "This is a gentle reminder that the <b>Morning Meeting</b> is scheduled for today.<br><br>" + "<b>Date:</b> " + meeting_date + "<br>" + "<b>Time:</b> 9:30 AM<br><br>" + "You have already confirmed your attendance. Please ensure you join on time.<br><br>" + "Regards,<br>ENAM AMC Research Team"
				]
				att.Reminder_3=true;
			}
		}
	}
}
