void processPriceMaster()
{
	fileId = "0vc13b6995068458b43dbb10c05a9aaf0cc67";
	chunkSize = 1000;
	fileResponse = invokeurl
	[
		url :"https://download.zoho.in/v1/workdrive/download/" + fileId
		type :GET
		connection:"zoho_workdrive_connection"
	];
	csvRows = fileResponse.toString().toList("\n");
	dataRows = csvRows.subList(1,csvRows.size());
	totalRows = dataRows.size();
	for each  iter in {"0","1","2","3"}
	{
		startIndex = iter.toLong() * chunkSize;
		if(startIndex >= totalRows)
		{
			continue;
		}
		endIndex = startIndex + chunkSize;
		if(endIndex > totalRows)
		{
			endIndex = totalRows;
		}
		chunkRows = dataRows.subList(startIndex,endIndex);
		thisapp.processChunk(chunkRows,startIndex,endIndex,"price");
	}
	info "Price Master Processing Completed. Total Rows: " + totalRows;
	message = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" + "<div style='padding: 20px; border: 1px solid #e0e0e0; border-radius: 6px;'>" + "<p>Dear Team,</p>" + "<p>The <strong>Price Master</strong> has been successfully updated. " + "The latest pricing details are now available in the system and the total number of rows processed are <strong>" + totalRows + "</strong> .</p>" + "<p>You may review the updated information at your convenience. If you have any questions or require " + "further assistance, please do not hesitate to contact us.</p>" + "<p>Best regards,<br/><strong>ENAM IT Team</strong></p>" + "</div></body></html>";
	if(zoho.appuri.contains("environment"))
	{
		sendTo = "parth@fristinetech.com";
	}
	else
	{
		sendTo = "arvind.prajapati@enamamc.com";
	}
	sendmail
	[
		from :"parth@fristinetech.com"
		to :sendTo
		subject :"Price Master Successfully Processed on " + zoho.currentdate.toString("dd-MM-yyyy")
		message :message
	]
}
