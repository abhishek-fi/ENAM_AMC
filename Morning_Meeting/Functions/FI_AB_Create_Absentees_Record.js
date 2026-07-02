void FI_AB_Create_Absentees_Record(int meetingId)
{
	rec = Meeting_Details[ID == meetingId];
	info rec.Meeting_Title;
	members = Morning_Meeting_Attendance[Meeting_Detail == meetingId && Will_you_be_able_to_join_tomorrow == "Yes"].Analyst_Name.getAll();
	// 	info members;
	addedUsers = Morning_Meeting_Notes[Meeting_Detail == meetingId && Have_you_attended_today_s_meeting == "Yes" || Have_you_attended_today_s_meeting == "No"].Analyst.getAll();
	// 	info addedUsers;
	members.removeAll(addedUsers);
	// 	info members;
	for each  userID in members
	{
		NewRecId = insert into Morning_Meeting_Notes
		[
			Added_User=zoho.loginuser
			Meeting_Detail=meetingId
			Analyst=userID
			Have_you_attended_today_s_meeting="No"
		];
		newDetails = Morning_Meeting_Notes[ID == NewRecId];
		info newDetails.ID;
	}
	noRecs = Morning_Meeting_Attendance[Meeting_Detail == meetingId && Will_you_be_able_to_join_tomorrow == "No"];
	addedRecs = Morning_Meeting_Notes[Meeting_Detail == meetingId].Analyst.getAll();
	for each  noRec in noRecs
	{
		info noRecs.Not_attended_reason;
		if(Morning_Meeting_Notes[Meeting_Detail == meetingId && Analyst == noRec.Analyst_Name].count() == 0)
		{
			NewRecId = insert into Morning_Meeting_Notes
			[
				Added_User=zoho.loginuser
				Meeting_Detail=meetingId
				Analyst=noRec.Analyst_Name
				Have_you_attended_today_s_meeting="No"
				Not_attended_reason=noRec.Not_attended_reason
			];
		}
		else if(Morning_Meeting_Notes[Meeting_Detail == meetingId && Analyst == noRec.Analyst_Name].count() > 0)
		{
			recNow = Morning_Meeting_Notes[Meeting_Detail == meetingId && Analyst == noRec.Analyst_Name];
			if(recNow.Have_you_attended_today_s_meeting == "" || recNow.Have_you_attended_today_s_meeting == null)
			{
				recNow.Not_attended_reason=noRec.Not_attended_reason;
				recNow.Have_you_attended_today_s_meeting="No";
			}
		}
	}
	cont = rec.Meeting_Title;
	// 	sendmail
	// 	[
	// 		from :"rms@enamamc.com"
	// 		to :"abhishek@fristinetech.com"
	// 		subject :"Test Absentees"
	// 		message :cont
	// 	]
}
