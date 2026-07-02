// On 31-Jul-2025 - At 09:00:00 Daily - Remainder2
// Scheduler disabled as per client request
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
thisapp.getsecondremainder();
