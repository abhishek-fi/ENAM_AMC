void GetValuationChartFromExcel(int recId)
{
	// 	recId = recId.toLong();
	// 	recData = One_Page_Module[ID == recId];
	// 	bTicker = recData.Bloomberg_Ticker;
	// 	info bTicker;
	paramMap = Map();
	paramMap.put('method','worksheet.content.get');
	paramMap.put('worksheet_name','AIAE');
	paramMap.put('start_row',1);
	paramMap.put('start_column',1);
	paramMap.put('end_row',15);
	paramMap.put('end_column',26);
	paramMap.put('visible_columns_only',true);
	paramMap.put('response_type','default');
	resourceId = "hkx0j4559d438ff334ec68150f377253d3140";
	response = invokeurl
	[
		url :"https://sheet.zoho.in/api/v2/" + resourceId
		type :POST
		parameters:paramMap
		connection:"zoho_oauth_connection"
	];
	info response;
	response.setFileName("testfile.xlsx");
	info response;
	// 	sendmail
	// 	[
	// 		from :"rms@enamamc.com"
	// 		to :"abhishek@fristinetech.com"
	// 		subject :"Test Zoho Sheet APIs"
	// 		message :"KFA"
	// 		Attachments :file:response
	// 	]
}
