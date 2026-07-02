void thirdMeetingNotesremainder()
{
	today = zoho.currentdate;
	day = today.getDayOfWeek();
	if(day == 1 || day == 7)
	{
		info "Weekend - skipping reminder.";
		return;
	}
	meetings = Meeting_Details[Meeting_Date == today];
	if(meetings.count() == 0)
	{
		info "No meetings found for today.";
		return;
	}
	attendance_records = Morning_Meeting_Attendance[Meeting_Detail == meetings.ID];
	for each  att in attendance_records
	{
		analyst = att.Analyst_Name;
		full_name = analyst.First_Name + " " + analyst.Last_Name;
		email = analyst.Email_Id;
		response = ifnull(att.Will_you_be_able_to_join_tomorrow,"").trim();
		// Skip users who responded "No"
		if(response == "No" || analyst.User_Status != "Active")
		{
			continue;
		}
		attendance_marked = response == "Yes";
		attendance_not_marked = response == "" || response == "Not Responded";
		// Check notes
		notes_added = false;
		notes_records = Morning_Meeting_Notes[Analyst.ID == analyst.ID];
		for each  note in notes_records
		{
			if(note.Morning_Notes != null)
			{
				for each  row in note.Morning_Notes
				{
					if(row.Meet_Note != null && row.Meet_Note.trim() != "")
					{
						notes_added = true;
						break;
					}
				}
			}
			if(notes_added)
			{
				break;
			}
		}
		// If both attendance and notes are marked, no mail needed
		if(attendance_marked && notes_added)
		{
			continue;
		}
		// Start composing mail
		message_body = "Dear " + full_name + ",<br><br>";
		message_body = message_body + "This is a reminder regarding your morning meeting updates.<br><br>";
		message_body = message_body + "<b>Your Current Status & Required Action:</b><br><br>";
		// Dynamic status and action
		if(attendance_not_marked && !notes_added)
		{
			message_body = message_body + " Attendance Not Marked<br> Meeting Notes Pending<br><br>";
			message_body = message_body + "Please mark your attendance and update the meeting notes at the earliest.<br><br>";
		}
		else if(attendance_not_marked && notes_added)
		{
			message_body = message_body + " Attendance Not Marked<br> Meeting Notes Added<br><br>";
			message_body = message_body + "Kindly ensure that you mark your attendance for the meeting.<br><br>";
		}
		else if(attendance_marked && !notes_added)
		{
			message_body = message_body + " Attendance Marked<br> Meeting Notes Pending<br><br>";
			message_body = message_body + "Please update your meeting notes in the system.<br><br>";
		}
		// Add links
		updateLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Form:Morning_Meeting_Attendance?recLinkID=" + att.ID.toString() + "&viewLinkName=All_Morning_Meeting_Attendances";
		notes_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Meeting_Notes?meetingId=" + meetings.ID.toString();
		message_body = message_body + "<b>Action Required:</b><br>";
		// 		if(attendance_not_marked)
		// 		{
		// 			message_body = message_body + " <a href='" + updateLink + "'>Click here to update your attendance</a><br>";
		// 		}
		if(!notes_added || attendance_not_marked)
		{
			message_body = message_body + " <a href='" + notes_link + "'>Click here to update</a><br>";
		}
		message_body = message_body + "<br>Please complete the pending action(s) before <b>11:30 AM today</b>.<br><br>";
		message_body = message_body + "Regards,<br><b>ENAM AMC Research Team</b>";
		// Send mail
		if(email != null && email != "" && analyst.Profile == "Analyst")
		{
			sendmail
			[
				from :"rms@enamamc.com"
				to :email
				subject :"Reminder: Morning Meeting Updates Incomplete – Action Needed"
				message :message_body
			]
		}
		notes_records.Reminder_6=true;
	}
}
