void Post_Meeting_Attendance_Request_FI_AB(int meetingId)
{
	preRecs = Morning_Meeting_Attendance[Meeting_Detail == meetingId];
	if(preRecs.count(ID) > 0)
	{
		for each  rec in preRecs
		{
			analystId = rec.Analyst_Name;
			mmnRec = Morning_Meeting_Notes[Meeting_Detail == meetingId && Analyst == analystId.ID];
			if(mmnRec.count(ID) == 0)
			{
				newId = insert into Morning_Meeting_Notes
				[
					Added_User=zoho.loginuser
					Meeting_Detail=meetingId
					Analyst=analystId.ID
				];
			}
		}
	}
	attRecs = Morning_Meeting_Notes[Meeting_Detail == meetingId];
	for each  att in attRecs
	{
		info att;
		if(att.Have_you_attended_today_s_meeting == null || att.Have_you_attended_today_s_meeting == "")
		{
			analyst_record = att.Analyst;
			if(analyst_record != null && analyst_record.Email_Id != null && analyst_record.Email_Id != "" && analyst_record.Profile != "Fund Manager" && analyst_record.Profile != "Head of Research" && analyst_record.User_Status == "Active")
			{
				info analyst_record.Full_Name_backend;
				textID = att.ID.toString();
				baseUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Post_Meeting_Attendance_Update/2VY5zu0je42WPHt9YSVR5AjevPZvEvzmHBeyUeDxX6zeubDVXmSE0uOPU7BUmDvGNtRe7aeaP3d6jtDmCBGjAPsQ6CtkVmavRveg";
				yesLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=offline";
				onlineLink = baseUrl + "?recID=" + textID + "&doesJoin=true&mode=online";
				noLink = baseUrl + "?recID=" + textID + "&doesJoin=false&mode=none";
				emailBody = "<div style='margin:20px 0;'>";
				emailBody = emailBody + "<a href='" + yesLink + "' style='background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Conference Room</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + onlineLink + "' style='background-color:#1a73e8;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>MS Teams Call</a>&nbsp;&nbsp;";
				emailBody = emailBody + "<a href='" + noLink + "' style='background-color:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;'>Not Attended</a>&nbsp;&nbsp;";
				emailBody = emailBody + "</div>";
				buttons = emailBody;
				sendmail
				[
					from :"rms@enamamc.com"
					to :analyst_record.Email_Id
					subject :"Morning Meeting Attendance Request – " + today.toString("dd-MMM-yyyy")
					message :"Dear " + analyst_record.First_Name + ",<br><br>" + "Kindly mark your attendance for today's Morning Meeting Attended…<br><br>" + buttons + "<i>* Please action before 11:15 AM</i><br><br>" + "Regards,<br>ENAM AMC Research Team"
				]
			}
		}
	}
}
