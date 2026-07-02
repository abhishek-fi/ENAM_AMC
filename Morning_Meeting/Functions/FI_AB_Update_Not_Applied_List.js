void FI_AB_Update_Not_Applied_List(int recId)
{
	masterRec = Morning_Meeting_Notes_Master[Meeting_Detail == recId];
	if(masterRec.count() == 0)
	{
		masterId = insert into Morning_Meeting_Notes_Master
		[
			Added_User=zoho.loginuser
			Meeting_Detail=recId
		];
		masterRec = Morning_Meeting_Notes_Master[ID == masterId];
	}
	if(masterRec.count() > 0)
	{
		attList = Morning_Meeting_Attendance[Meeting_Detail == recId && Will_you_be_able_to_join_tomorrow == "" || Will_you_be_able_to_join_tomorrow == "Not Responded"].ID.getAll();
		// 	info attList;
		postMeetingUsers = Morning_Meeting_Notes[Meeting_Detail == recId && Have_you_attended_today_s_meeting != "Yes" || Have_you_attended_today_s_meeting != "No"].Analyst.getAll();
		recordedList = List();
		for each  m in postMeetingUsers
		{
			associtedRec = Morning_Meeting_Attendance[Meeting_Detail == recId && Analyst_Name == m].ID;
			recordedList.add(associtedRec);
			// 			info recordedList;
		}
		info recordedList;
		attList.removeAll(recordedList);
		info attList;
		masterRec.Not_Applied_List=attList;
		htmlContent = "<div style='page-break-inside: avoid;'>";
		// --- Not Applied List ---
		htmlContent = htmlContent + "<p style='color: #4a90d9; font-size: 14px; font-weight: bold; margin-bottom: 8px;'>Not Applied List</p>";
		htmlContent = htmlContent + "<table style='border-collapse: collapse; width: 100%;'>";
		htmlContent = htmlContent + "<tr style='background-color: #f0f0f0;'>";
		htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000; font-size: 12px; font-weight: bold;'>Analyst Name</td>";
		htmlContent = htmlContent + "</tr>";
		for each  rec in masterRec.Not_Applied_List
		{
			fullName = rec.Analyst_Name.First_Name + " " + rec.Analyst_Name.Last_Name;
			htmlContent = htmlContent + "<tr style='border-bottom: 1px solid #eee;'>";
			htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000;'>" + fullName + "</td>";
			htmlContent = htmlContent + "</tr>";
		}
		htmlContent = htmlContent + "</table></div>";
		masterRec.Not_Applied_List_RT=htmlContent;
	}
}
