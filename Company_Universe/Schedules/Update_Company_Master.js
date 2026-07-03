// On 07-Feb-2026 - At 09:20:00 Daily - Update Company Master
today = zoho.currentdate.getDayOfWeek();
if(today != 1 && today != 7)
{
	thisapp.processCompanyMaster();
}
