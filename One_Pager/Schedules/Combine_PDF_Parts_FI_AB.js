// On 26-Apr-2026 - At 20:12:00 Daily - Combine_PDF_Parts_FI_AB
// should be monthly
// ----- Generate Month_Year_Code for previous month -----
current_date = zoho.currenttime;
first_day_current_month = current_date.toStartOfMonth();
last_day_prev_month = first_day_current_month.addDay(-1);
first_day_prev_month = last_day_prev_month.toStartOfMonth();
monthYearCode = first_day_prev_month.toDate().toString("MMM-yyyy");
info "Running final combine for Month_Year_Code = " + monthYearCode;
// ----- Fetch One_Pager_Report record — must exist -----
existing = One_Pager_Report[Month_Year_Code == monthYearCode];
if(existing.count() == 0)
{
	info "ERROR: No One_Pager_Report record found for " + monthYearCode + ". Aborting.";
	return;
}
reportRec = existing;
folderId = reportRec.Folder_Id;
if(ifnull(folderId,"") == "")
{
	info "ERROR: Folder_Id is empty on One_Pager_Report for " + monthYearCode + ". Aborting.";
	return;
}
// ----- Collect all Part status URLs from the record -----
partStatusLinks = list();
partStatusLinks.add(ifnull(reportRec.Part_1_Status_Link,""));
partStatusLinks.add(ifnull(reportRec.Part_2_Status_Link,""));
partStatusLinks.add(ifnull(reportRec.Part_3_Status_Link,""));
partStatusLinks.add(ifnull(reportRec.Part_4_Status_Link,""));
partStatusLinks.add(ifnull(reportRec.Part_5_Status_Link,""));
// Filter out empty ones
activeLinks = list();
for each  link in partStatusLinks
{
	if(link != "")
	{
		activeLinks.add(link);
	}
}
if(activeLinks.size() == 0)
{
	info "ERROR: No Part status URLs found on record for " + monthYearCode + ". Aborting.";
	return;
}
info "Found " + activeLinks.size() + " part(s) to combine";
// ----- Check all parts are completed before proceeding -----
for each  statusUrl in activeLinks
{
	jobResp = invokeurl
	[
		url :statusUrl
		type :GET
		connection:"zoho_oauth_connection"
	];
	jobStatus = ifnull(jobResp.get("status"),"unknown");
	if(jobStatus != "completed")
	{
		info "ERROR: Part job at " + statusUrl + " is not completed (status=" + jobStatus + "). Aborting.";
		return;
	}
}
info "All parts completed. Proceeding with final combine.";
// ----- Download each part PDF and build paramList -----
paramList = list();
input_options = Map();
fileIndex = 1;
for each  statusUrl in activeLinks
{
	try 
	{
		// Re-fetch the job to get the download_link
		jobResp = invokeurl
		[
			url :statusUrl
			type :GET
			connection:"zoho_oauth_connection"
		];
		downloadLink = jobResp.get("download_link");
		if(ifnull(downloadLink,"") == "")
		{
			info "ERROR: No download_link for part " + fileIndex + " at " + statusUrl + ". Aborting.";
			return;
		}
		// Download the part PDF
		fileResp = invokeurl
		[
			url :downloadLink
			type :GET
			connection:"zoho_oauth_connection"
		];
		// Build multipart param name: files, files1, files2 ...
		forParam = "files";
		if(fileIndex > 1)
		{
			forParam = forParam + (fileIndex - 1).toString();
		}
		paramList.add({"paramName":forParam,"content":fileResp});
		// Page range for each part
		document_opts = Map();
		document_opts.put("page_ranges","1-20");
		input_options.put(fileIndex.toString(),document_opts);
		fileIndex = fileIndex + 1;
	}
	catch (e)
	{
		info "ERROR: Failed downloading part " + fileIndex + " : " + e + ". Aborting.";
		return;
	}
}
if(paramList.size() == 0)
{
	info "ERROR: No PDFs downloaded. Aborting.";
	return;
}
// ----- Output settings -----
outputFileName = monthYearCode + " Combined.pdf";
output_settings = Map();
output_settings.put("name",outputFileName);
output_settings.put("folder_id",folderId);
output_settings.put("overwrite_existing_file",false);
paramList.add({"paramName":"output_settings","content":output_settings.toString(),"Content-Type":"application/json","stringPart":"true"});
paramList.add({"paramName":"input_options","content":input_options.toString(),"Content-Type":"application/json","stringPart":"true"});
// ----- Call Zoho Writer combine API -----
combinepdf_response = invokeurl
[
	url :"https://www.zohoapis.in/writer/api/v1/documents/pdf/combine/store"
	type :POST
	files:paramList
	connection:"zoho_oauth_connection"
];
info "Final combine raw response: " + combinepdf_response;
// ----- Store status_url in Combined_Status_Link -----
try 
{
	respMap = combinepdf_response.toMap();
	if(respMap.containKey("status_url"))
	{
		combinedStatusUrl = respMap.get("status_url");
		jobStatus = ifnull(respMap.get("status"),"unknown");
		info "Final combine status=" + jobStatus + " url=" + combinedStatusUrl;
		reportRec.Combined_Status_Link=combinedStatusUrl;
		info "Saved Combined_Status_Link for " + monthYearCode;
	}
	else
	{
		info "ERROR: No status_url in final combine response: " + combinepdf_response;
	}
}
catch (e)
{
	info "ERROR: Failed to parse/save final combine response: " + e;
}
