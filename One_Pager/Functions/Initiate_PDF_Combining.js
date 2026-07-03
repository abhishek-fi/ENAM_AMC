void Initiate_PDF_Combining(List recordIds, Int batchNumber, String monthYearCode)
{
	paramList = list();
	input_options = Map();
	monthLabel = zoho.currentdate.subMonth(1).toString("MMM yyyy");
	fileIndex = 1;
	for each  recId in recordIds
	{
		try 
		{
			// Step 2: re-fetch record in case generation updated it
			rec = One_Page_Module[ID == recId];
			compName = rec.Company_Name.Company_Name;
			// Step 3: build the page-perma URL with encoded filename
			fileName = compName + " - " + monthLabel;
			encodedFileName = zoho.encryption.urlEncode(fileName);
			pdfFile = zoho.file.convertToPDF(rec.Print_Layout_HTML);
			// Step 5: build the multipart param name expected by Writer API
			// First file uses paramName "files", rest are "files1", "files2", ...
			forParam = "files";
			if(fileIndex > 1)
			{
				forParam = forParam + (fileIndex - 1).toString();
			}
			paramList.add({"paramName":forParam,"content":pdfFile});
			// Optional: take only first 2 pages of each one-pager.
			// Remove this block if you want the entire PDF for each record.
			document_opts = Map();
			document_opts.put("page_ranges","1,2");
			input_options.put(fileIndex.toString(),document_opts);
			fileIndex = fileIndex + 1;
		}		catch (e)
		{
			info "Failed for record " + recId + " in batch " + batchNumber + " : " + e;
			// continue with next record
		}
	}
	if(paramList.size() == 0)
	{
		info "Batch " + batchNumber + " has no valid PDFs to combine. Skipping.";
		return;
	}
	// ----- Output settings -----
	output_settings = Map();
	output_settings.put("name","OnePagers-" + monthLabel + "-Batch-" + batchNumber + ".pdf");
	output_settings.put("folder_id","kftie8153e640d77f419b9d16e6ba4d8a9ad9");
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
	info "Batch " + batchNumber + " raw response: " + combinepdf_response;
	// ----- Extract status_url and persist into One_Page_Report -----
	try 
	{
		respMap = combinepdf_response.toMap();
		if(respMap.containKey("status_url"))
		{
			statusUrl = respMap.get("status_url");
			jobStatus = ifnull(respMap.get("status"),"unknown");
			info "Batch " + batchNumber + " status=" + jobStatus + " url=" + statusUrl;
			// Upsert into One_Page_Report keyed by Month_Year_Code
			existing = One_Pager_Report[Month_Year_Code == monthYearCode];
			if(existing.count() > 0)
			{
				if(batchNumber == 1)
				{
					existing.Part_1_Status_Link=statusUrl;
				}
				else if(batchNumber == 2)
				{
					existing.Part_2_Status_Link=statusUrl;
				}
				else if(batchNumber == 3)
				{
					existing.Part_3_Status_Link=statusUrl;
				}
				else if(batchNumber == 4)
				{
					existing.Part_4_Status_Link=statusUrl;
				}
				else if(batchNumber == 5)
				{
					existing.Part_5_Status_Link=statusUrl;
				}
				else
				{
					info "Batch number " + batchNumber + " exceeds Part_5 — cannot store " + statusUrl;
					//                 return;
				}
			}
		}
		else
		{
			info "No status_url returned for batch " + batchNumber + " : " + combinepdf_response;
		}
	}	catch (e)
	{
		info "Failed to parse/save status_url for batch " + batchNumber + " : " + e;
	}
}
