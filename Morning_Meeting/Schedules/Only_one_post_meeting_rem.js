// On 27-May-2026 - At 09:30:00 Daily - Only_one_post_meeting_reminder_FI_AB
today = zoho.currentdate;
day = today.getDayOfWeek();
if(day == 1 || day == 7)
{
	info "Today is weekend.";
	return;
}
meetings = Meeting_Details[Meeting_Date == today];
info meetings.Meeting_Title;
if(meetings.ID != null)
{
	info meetings.ID;
	thisapp.Post_Meeting_Attendance_Request_FI_AB(meetings.ID);
}
