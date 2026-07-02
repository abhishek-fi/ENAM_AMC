// On 05-Aug-2025 - At 10:30:00 Daily - daily Meeting notes
// Scheduler disabled as per client request
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
thisapp.send_meeting_notes_request_email();
