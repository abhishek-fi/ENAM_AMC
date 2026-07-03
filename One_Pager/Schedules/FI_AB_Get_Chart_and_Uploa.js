// On 10-Apr-2026 - At 20:34:00 Daily - FI_AB Get Chart and Upload
// as of now it's running daily it should be configured to run monthly
// Get current date-time
current_date = zoho.currenttime;
// Step 1: First day of current month
first_day_current_month = current_date.toStartOfMonth();
// Step 2: Last day of previous month
last_day_prev_month = first_day_current_month.addDay(-1);
// Step 3: First day of previous month
first_day_prev_month = last_day_prev_month.toStartOfMonth();
// Optional: Set time boundaries
start_datetime = first_day_prev_month.toDate().toString("yyyy-MM-dd") + " 00:00:00";
end_datetime = last_day_prev_month.toDate().toString("yyyy-MM-dd") + " 23:59:59";
// Convert to datetime format
start_datetime = start_datetime.toTime();
end_datetime = end_datetime.toTime();
// Fetch records
onePagerList = One_Page_Module[Submitted_Date >= start_datetime && Submitted_Date <= end_datetime && Status == "Submitted"];
token = thisapp.getAccessToken_FI_AB();
// token = "1000.9649e83cd62c8d929806efbc7db3ae9a.4e4f376e6d9b07b38214f34ea732e7e3";
// info token;
for each  rec in onePagerList
{
	bTicker = rec.Bloomberg_Ticker;
	recId = rec.ID;
	// info bTicker;
	paramMap = Map();
	paramMap.put('method','worksheet.content.get');
	paramMap.put('worksheet_name',bTicker);
	paramMap.put('start_row',1);
	paramMap.put('start_column',1);
	paramMap.put('end_row',516);
	paramMap.put('end_column',15);
	paramMap.put('visible_columns_only',true);
	paramMap.put('response_type','default');
	resourceId = "ln7pj9f96d9e6b0224aa3a89bfb84dbe7265c";
	response = invokeurl
	[
		url :"https://sheet.zoho.in/api/v2/" + resourceId
		type :POST
		parameters:paramMap
		connection:"zoho_oauth_connection"
	];
	// 	info response;
	// ----------------------------
	// 1. INITIALIZE
	// ----------------------------
	sheetResponse = response;
	rangeDetails = sheetResponse.get("range_details");
	dataList = List();
	meanVal = null;
	plus1Val = null;
	minus1Val = null;
	// ----------------------------
	// 2. LOOP THROUGH ROWS
	// ----------------------------
	for each  row in rangeDetails
	{
		rowIndex = row.get("row_index");
		rowDetails = row.get("row_details");
		// ----------------------------
		// 2A. EXTRACT HEADER STATS
		// ----------------------------
		if(rowIndex == 1)
		{
			for each  col in rowDetails
			{
				if(col.get("column_index") == 6)
				{
					// 					info col.get("content");
					meanVal = col.get("content").trim().replaceAll(",","").toDecimal();
				}
				// 			if(col.get("column_index") == 2)
				// 			{
				// 				title = col.get("content");
				// 				info title;
				// 			}
			}
		}
		if(rowIndex == 2)
		{
			for each  col in rowDetails
			{
				if(col.get("column_index") == 8)
				{
					plus1Val = col.get("content").trim().replaceAll(",","").toDecimal();
				}
			}
		}
		if(rowIndex == 3)
		{
			for each  col in rowDetails
			{
				if(col.get("column_index") == 8)
				{
					minus1Val = col.get("content").trim().replaceAll(",","").toDecimal();
				}
			}
		}
		if(rowIndex == 4)
		{
			for each  col in rowDetails
			{
				if(col.get("column_index") == 5)
				{
					title = col.get("content").trim();
				}
			}
		}
		// ----------------------------
		// 2B. EXTRACT ACTUAL DATA
		// ----------------------------
		if(rowIndex > 4)
		{
			dateVal = "";
			peVal = "";
			for each  col in rowDetails
			{
				colIndex = col.get("column_index");
				content = col.get("content");
				if(colIndex == 2)
				{
					dateVal = content;
				}
				else if(colIndex == 5)
				{
					peVal = content;
				}
			}
			if(dateVal != "" && peVal != "")
			{
				record = Map();
				record.put("Date",dateVal);
				record.put("PE",peVal);
				dataList.add(record);
			}
		}
	}
	// ----------------------------
	// 3. BUILD INPUT MAP
	// ----------------------------
	inputMap = Map();
	inputMap.put("data",dataList);
	// Pass Excel-calculated values directly to chart function
	if(meanVal != null)
	{
		inputMap.put("mean",meanVal);
	}
	if(plus1Val != null)
	{
		inputMap.put("plus1",plus1Val);
	}
	if(minus1Val != null)
	{
		inputMap.put("minus1",minus1Val);
	}
	if(recId != null)
	{
		inputMap.put("id",recId.toString());
	}
	if(title != "")
	{
		inputMap.put("title",title);
	}
	if(token != null && token != "")
	{
		inputMap.put("token",token);
	}
	// else 
	// {
	// 	break;
	// }
	iString = inputMap.toString();
	info iString;
	resp = thisapp.generateChart(iString);
	info resp;
	// 	sendmail
	// 	[
	// 		from :"rms@enamamc.com"
	// 		to :"abhishek@fristinetech.com"
	// 		subject :"Chart generation response"
	// 		message :resp
	// 	]
	// shows upload result — remove once confirmed working
	// 	info rec.ID;
}
