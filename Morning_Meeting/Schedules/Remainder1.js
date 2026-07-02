// On 31-Jul-2025 - At 17:00:00 Daily - Remainder1
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
thisapp.send_meeting_attendance_reminders();
