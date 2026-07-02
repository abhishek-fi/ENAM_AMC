// On 05-Aug-2025 - At 11:00:00 Daily - First Meting Notes Remainder
// Scheduler disabled as per client request
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
thisapp.send_meeting_Notes_Second_reminder();
