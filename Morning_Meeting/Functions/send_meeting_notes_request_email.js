void send_meeting_notes_request_email()
{
	today = zoho.currentdate;
	day = today.getDayOfWeek();
	if(day == 1 || day == 7)
	{
		info "It's weekend. Skipping note reminders.";
		return;
	}
	meetings = Meeting_Details[Meeting_Date == today];
	for each  meeting in meetings
	{
		attendances = Morning_Meeting_Attendance[Meeting_Detail == meeting.ID];
		for each  att in attendances
		{
			info att;
			analyst_record = att.Analyst_Name;
			if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile == "Analyst" || analyst_record.Profile == "Analyst Admin" && analyst_record.User_Status == "Active")
			{
				full_name = analyst_record.First_Name + " " + analyst_record.Last_Name;
				info full_name;
				email = analyst_record.Email_Id;
				info email;
				notes_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Meeting_Notes";
				linkWithId = notes_link + "?meetingId=" + meeting.ID.toString();
				message_body = "Dear " + full_name + ",<br><br>";
				notesAdded = false;
				attAdded = false;
				existingRecs = Morning_Meeting_Notes[Analyst == analyst_record && Meeting_Detail == meeting.ID];
				if(existingRecs.count(ID) > 0)
				{
					for each  rec in existingRecs
					{
						if(rec.Have_you_attended_today_s_meeting != "" || rec.Have_you_attended_today_s_meeting != null)
						{
							attAdded = true;
						}
						if(Morning_Notes[Morning_Meeting_Notes == rec.ID].count(ID) > 0)
						{
							notesAdded = true;
						}
					}
				}
				if(notesAdded && attAdded)
				{
					continue;
				}
				if(notesAdded && !attAdded)
				{
					sub = "Request to Add Meeting Attendance – Today's Morning Meeting";
					msgContent = "We kindly request you to add your post-meeting attendance at your earliest convenience.<br><br>";
				}
				else if(!notesAdded && attAdded)
				{
					sub = "Request to Add Meeting Notes – Today's Morning Meeting";
					msgContent = "We kindly request you to add your meeting notes at your earliest convenience.<br><br>";
				}
				else
				{
					sub = "Request to Add Meeting Notes and Attendance – Today's Morning Meeting";
					msgContent = "We kindly request you to add your meeting notes and attendance at your earliest convenience.<br><br>";
				}
				message_body = message_body + "We hope you had a productive discussion during today's Analyst Meeting.<br><br>";
				message_body = message_body + msgContent;
				message_body = message_body + "<b><a href='" + linkWithId + "'>Click here to add your meeting notes</a></b><br><br>";
				message_body = message_body + "Your timely input helps us maintain high standards of collaboration and transparency across our research team.<br><br>";
				message_body = message_body + "Best regards,<br>";
				message_body = message_body + "<b>ENAM AMC Research Team</b>";
				sendmail
				[
					from :"rms@enamamc.com"
					to :analyst_record.Email_Id
					subject :sub
					message :message_body
				]
				stat = "Reminder sent to: " + full_name;
				// 				note = Morning_Meeting_Notes[Analyst == analyst_record];
				// 				note.Reminder_4=true;
				// 				sendmail
				// 				[
				// 					from :"rms@enamamc.com"
				// 					to :"abhishek@fristinetech.com"
				// 					subject :sub + " >> " + stat
				// 					message :message_body
				// 				]
			}
		}
	}
}
