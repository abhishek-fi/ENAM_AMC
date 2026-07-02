void send_meeting_attendance_reminders()
{
	today = zoho.currentdate;
	tomorrow = today.addDay(1);
	day = tomorrow.getDayOfWeek();
	if(day == 1 || day == 7)
	{
		info "Tomorrow is weekend.";
		return;
	}
	meetings = Meeting_Details[Meeting_Date == tomorrow];
	info meetings;
	for each  meeting in meetings
	{
		attendances = Morning_Meeting_Attendance[Meeting_Detail == meeting.ID && Will_you_be_able_to_join_tomorrow == "" || Will_you_be_able_to_join_tomorrow == "Not Responded"];
		info attendances;
		for each  att in attendances
		{
			analyst_record = att.Analyst_Name;
			if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile != "Fund Manager" && analyst_record.User_Status == "Active")
			{
				// 				updateLink = "https://creatorapp.zoho.in"+zoho.appuri+"#Form:Morning_Meeting_Attendance?recLinkID=" + att.ID.toString() + "&&viewLinkName=All_Morning_Meeting_Attendances";
				textID = att.ID.toString();
				baseUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Morning_Meetings_Attendance_Update/ke1JjMhtMXmdhSOs2fB52hjT1DZyfrW4P3nUfyuSzCxGJaSbOwV2P7waNUkjmsBtT6N0nQUTgmsAXBMNEfkFA1t89NQndERsVgbq";
				yesLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=offline";
				onlineLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=online";
				noLink = baseUrl + "?recID=" + textID + "&doesJoin=false&mode=none";
				//---
				emailBody = "<div style='margin:20px 0;'>";
				emailBody = emailBody + "<a href='" + yesLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attending In-person</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + onlineLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Attend via Teams</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + noLink + "' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Not attending</a>&nbsp;&nbsp;";
				emailBody = emailBody + "</div>";
				buttons = emailBody;
				//---
				sendmail
				[
					from :"rms@enamamc.com"
					to :analyst_record.Email_Id
					subject :"Reminder: Meeting Attendance Pending"
					message :"Dear " + analyst_record.First_Name + ",<br><br>" + "This is a reminder that your meeting attendance has not been recorded yet.<br>" + "Please update your attendance.<br><br>" + buttons + "<b>Deadline:</b> " + tomorrow.toString("dd-MMM-yyyy") + " 9:30 AM<br><br>" + "Regards,<br>ENAM AMC Research Team"
				]
				info "sent to: " + analyst_record.First_Name;
				att.Reminder_1=true;
			}
		}
	}
}
