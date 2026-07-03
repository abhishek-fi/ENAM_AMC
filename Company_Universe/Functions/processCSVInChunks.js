void processCSVInChunks(int startIndex)
{
	fileId = "0vc13b6995068458b43dbb10c05a9aaf0cc67";
	chunkSize = 1000;
	if(startIndex == null)
	{
		startIndex = 0;
	}
	fileResponse = invokeurl
	[
		url :"https://download.zoho.in/v1/workdrive/download/" + fileId
		type :GET
		connection:"zoho_workdrive_connection"
	];
	csvRows = fileResponse.toString().toList("\n");
	dataRows = csvRows.subList(1,csvRows.size());
	if(startIndex >= dataRows.size())
	{
		info "Company Master Processing Completed. Total Rows: " + dataRows.size();
		return;
	}
	endIndex = startIndex + chunkSize;
	if(endIndex > dataRows.size())
	{
		endIndex = dataRows.size();
	}
	chunkRows = dataRows.subList(startIndex,endIndex);
	for each  row in chunkRows
	{
		if(row == null || row.isEmpty())
		{
			continue;
		}
		values = row.toList(",");
		if(values.size() <= 6)
		{
			continue;
		}
		Company_Name = values.get(1);
		Sheet_ISIN_No = values.get(6);
		Closing_Price = if(values.size() > 7,values.get(7),null);
		High_Price = if(values.size() > 10,values.get(10),null);
		Low_Price = if(values.size() > 11,values.get(11),null);
		CD_Bloomberg_Code = if(values.size() > 3,values.get(4),null);
		if(Sheet_ISIN_No == null || Sheet_ISIN_No.isEmpty())
		{
			continue;
		}
		cuRec = Company_Universe[CD_ISIN_No == Sheet_ISIN_No];
		if(cuRec != null)
		{
			cuRec.Company_Name=Company_Name;
			cuRec.CD_Bloomberg_Code=CD_Bloomberg_Code;
			cuRec.week_High_Date_amount=High_Price;
			cuRec.week_Low_Date_amount=Low_Price;
			cuRec.Closing_Price=Closing_Price;
		}
		else
		{
			cuRec = insert into Company_Universe
			[
				Company_Name=Company_Name
				CD_ISIN_No=Sheet_ISIN_No
				week_High_Date_amount=High_Price
				week_Low_Date_amount=Low_Price
				Closing_Price=Closing_Price
				Added_User=zoho.adminuser
			];
		}
	}
	info "Processed Company Master rows from " + startIndex + " to " + endIndex;
	thisapp.processCSVInChunks(endIndex);
}
