// On 26-Apr-2026 - At 20:15:00 Daily - Get_Final_PDF_FI_AB
// should be monthly and start of the month the one pagers should be generated, so accordingly it should be configured later
pendingRecs = One_Pager_Report[Combined_Status_Link != "" && Resource_Id == ""];
for each  rec in pendingRecs
{
	statusUrl = rec.Combined_Status_Link;
	jobResp = invokeurl
	[
		url :statusUrl
		type :GET
		connection:"zoho_oauth_connection"
	];
	fileId = jobResp.get("document_id");
	rec.Resource_Id=fileId;
}
