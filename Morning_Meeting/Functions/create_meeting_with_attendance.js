void create_meeting_with_attendance()
{
	thisday = zoho.currenttime;
	isHoliday = true;
	iteration = {1,2,3,4,5,6,7,8,9,10};
	for each  i in iteration
	{
		tomorrow = thisday.addDay(i);
		day = tomorrow.getDayOfWeek();
		if(day == 1 || day == 7)
		{
			info "holiday";
		}
		else
		{
			isHoliday = false;
			break;
		}
	}
	if(isHoliday == true)
	{
		return;
	}
	info tomorrow.getDate();
	existingMeetings = Meeting_Details[Meeting_Date != null] sort by Added_Time desc;
	info existingMeetings.Meeting_Date;
	nextDate = existingMeetings.Meeting_Date.getDate();
	info nextDate;
	if(nextDate == tomorrow.getDate())
	{
		info "Already created";
		return;
	}
	// 	if(day == 1 || day == 7)
	// 	{
	// 		info "Tomorrow is weekend. Skipping.";
	// 		return;
	// 	}
	// 	       userss= zoho.creator.getRecords("User_Master",);
	// 	info userss;
	//meetingDate = tomorrow.toString("dd-MMM-yyyy") + "10 AM";
	users = User_Master[ID != 0 && User_Status == "Active"];
	info users;
	rows_collection = Collection();
	for each  user in users
	{
		if(user.Profile == "Analyst" || user.Profile == "Analyst Admin")
		{
			full_name = user.First_Name + " " + user.Last_Name;
			subfrm = Meeting_Details.Analyst_Meeting_Attendance();
			subfrm.Analyst_Name=user.ID;
			subfrm.Will_you_be_able_to_join_tomorrow_s_meeting="";
			subfrm.Invited=true;
			rows_collection.insert(subfrm);
			//info subfrm;
		}
	}
	meeting = insert into Meeting_Details
	[
		Meeting_Title="Analyst Meeting - " + tomorrow.toString("dd-MMM-yyyy")
		Meeting_Date=tomorrow.subHour(2)
		Analyst_Meeting_Attendance=rows_collection
		Added_User=zoho.loginuser
	];
	info meeting;
	meetingD = Meeting_Details[ID == meeting];
	info meetingD.Analyst_Meeting_Attendance.Analyst_Name;
	for each  att_row in meetingD.Analyst_Meeting_Attendance
	{
		insert into Morning_Meeting_Attendance
		[
			Meeting_Detail=meetingD.ID
			Analyst_Name=att_row.Analyst_Name
			Will_you_be_able_to_join_tomorrow=att_row.Will_you_be_able_to_join_tomorrow_s_meeting
			Added_User=zoho.loginuser
		]
	}
	// by FI_AB to create a master with initail not applied list
	thisapp.FI_AB_Update_Not_Applied_List(meeting);
	// end of FI_AB
}
