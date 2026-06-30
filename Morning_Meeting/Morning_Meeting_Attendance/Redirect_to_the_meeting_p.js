// Created or Edited - Successful form submission - Redirect to the meeting page
attendances = Morning_Meeting_Attendance[Analyst_Name == input.Analyst_Name];
openUrl("https://creatorapp.zoho.in" + zoho.appuri + "#Report:All_Morning_Meeting_Attendances?ID=" + attendances.ID,"same window");
// edit_note = Meeting_Notes_Edit_Request[Analyst_Name == input.Analyst];
// 	info edit_note.ID;
// 	research_head_email = note.Analyst.Email_Id;
// 	analyst_name = note.Analyst.First_Name + " " + note.Analyst.Last_Name;
// 	company_name = note.Morning_Notes.Company_Name.Company_Name;
// 	meeting_note_link = "https://creatorapp.zoho.in" + zoho.appuri + "#Report:Meeting_Notes_Edit_Request_Report?ID=" + edit_note.ID;
