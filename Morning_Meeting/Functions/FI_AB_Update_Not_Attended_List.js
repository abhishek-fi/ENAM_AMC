void FI_AB_Update_Not_Attended_List(int recId)
{
	mmRecs = Morning_Meeting_Notes[Have_you_attended_today_s_meeting == "No" && Meeting_Detail == recId];
	masterRec = Morning_Meeting_Notes_Master[Meeting_Detail == recId];
	naList = mmRecs.ID.getall();
	info naList;
	masterRec.Not_Attended_List=naList;
	htmlContent = "<div style='page-break-inside: avoid;'>";
	htmlContent = htmlContent + "<p style='color: #4a90d9; font-size: 14px; font-weight: bold; margin-bottom: 8px;'>Not Attended List</p>";
	htmlContent = htmlContent + "<table style='border-collapse: collapse; width: 100%;'>";
	htmlContent = htmlContent + "<tr style='background-color: #f0f0f0;'>";
	htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000; font-size: 12px; font-weight: bold; width: 50%;'>Analyst Name</td>";
	htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000; font-size: 12px; font-weight: bold; width: 50%;'>Not attended reason</td>";
	htmlContent = htmlContent + "</tr>";
	for each  rec in masterRec.Not_Attended_List
	{
		fullName = rec.Analyst.First_Name + " " + rec.Analyst.Last_Name;
		htmlContent = htmlContent + "<tr style='border-bottom: 1px solid #eee;'>";
		htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000;'>" + fullName + "</td>";
		htmlContent = htmlContent + "<td style='padding: 8px 12px; color: #000;'>" + ifnull(rec.Not_attended_reason,"") + "</td>";
		htmlContent = htmlContent + "</tr>";
	}
	htmlContent = htmlContent + "</table></div>";
	masterRec.Not_Attended_List_RT=htmlContent;
}
