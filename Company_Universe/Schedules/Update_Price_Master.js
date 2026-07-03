// On 07-Feb-2026 - At 09:30:00 Daily - Update Price Master
today = zoho.currentdate.getDayOfWeek();
if(today != 1 && today != 7)
{
	thisapp.processPriceMaster();
}
