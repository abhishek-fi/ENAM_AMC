// On 07-Jan-2026 - At 15:00:00 Daily - send first meeting notification for tomorrow
// Scheduler disabled as per client request
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
tomorrow = zoho.currentdate.addDay(1);
day = tomorrow.getDayOfWeek();
if(day == 1 || day == 7)
{
	info "Tomorrow is weekend. Skipping.";
	return;
}
meetingD = Meeting_Details[Meeting_Date == tomorrow].ID;
thisapp.send_first_meeting_nofication(meetingD);
