// On 13-May-2026 - At 09:15:00 Daily - Only_one_pre_meeting_reminder_FI_AB
// Scheduler disabled as per client request
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
	thisapp.Pre_meeting_attendance_and_meeting_reminder(meetings.ID);
}
