void Generate_One_Pager_PDF_to_Workdrive(int recId)
{
	oneRec = One_Page_Module[ID == recId];
	// https://creatorapp.zohopublic.in/enamamc/research-application-env/page-perma/Print_One_Pager/zAZW21WgBwvpzRfupdaBCwjBJCKwM0jBMCXAtRxETSkFF4asUjx5DRbzvpwjYhZku6QCdk7N0xy7tRJ59xm3BNpr40Xv4ssPUuR9?recordId=310788000002220024&zc_FileName=spacing%20test.pdf
	//https://creatorapp.zohopublic.in/enamamc/research-application-env/pdf/Print_One_Pager/zAZW21WgBwvpzRfupdaBCwjBJCKwM0jBMCXAtRxETSkFF4asUjx5DRbzvpwjYhZku6QCdk7N0xy7tRJ59xm3BNpr40Xv4ssPUuR9?recordId=310788000002220024&zc_FileName={filename}
	appUri = zoho.appuri;
	if(appUri.contains("environment"))
	{
		return;
	}
	thisday = zoho.currentdate;
	day = thisday.getDayOfWeek();
	currDate = zoho.currentdate;
	formattedDate = oneRec.Added_Time.toString("MMMM yyyy");
	subFolderName = Company_Universe[ID == oneRec.Company_Name].Company_Name + " - " + formattedDate;
	fileName = subFolderName + ".pdf";
	encodedFileName = zoho.encryption.urlEncode(fileName);
	// 	info fileName;
	// 	info encodedFileName;
	//
	// 	fileUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "page-perma/Print_One_Pager/zAZW21WgBwvpzRfupdaBCwjBJCKwM0jBMCXAtRxETSkFF4asUjx5DRbzvpwjYhZku6QCdk7N0xy7tRJ59xm3BNpr40Xv4ssPUuR9?recordId=" + recId + "&zc_FileName=" + encodedFileName;
	// 	// 	fileUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "pdf/Print_One_Pager/zAZW21WgBwvpzRfupdaBCwjBJCKwM0jBMCXAtRxETSkFF4asUjx5DRbzvpwjYhZku6QCdk7N0xy7tRJ59xm3BNpr40Xv4ssPUuR9?recordId=" + recId.toString() + "&zc_FileName=" + encodedFileName;
	// 	// 	staticFileUrl = "https://creatorapp.zohopublic.in/enamamc/research-application-env/pdf/Print_One_Pager/zAZW21WgBwvpzRfupdaBCwjBJCKwM0jBMCXAtRxETSkFF4asUjx5DRbzvpwjYhZku6QCdk7N0xy7tRJ59xm3BNpr40Xv4ssPUuR9?recordId=310788000002220024&zc_FileName=spacing%20test.pdf";
	// 	// 	fileUrl = staticFileUrl;
	// 	info fileUrl;
	// 	fileResp = invokeurl
	// 	[
	// 		url :fileUrl
	// 		type :GET
	// 	];
	// 	info fileResp;
	// 	// 	fileResp.setFileName(encodedFileName);
	// 	// 	fileResp.setFileType("pdf");
	content = oneRec.Print_Layout_HTML;
	pdf = zoho.file.convertToPDF(content);
	// 	info pdf;
	sendmail
	[
		from :"rms@enamamc.com"
		to :"abhishek@fristinetech.com"
		subject :"Test Record PDF Resp"
		message :content
		Attachments :file:pdf
	]
	// info fileResp;
	//  // Getting folder id from Master, if not available, create a folder
	parentFolder = "hkx0jd92cea3d216e4b5ca9bca83621a6978d";
	folderId = oneRec.Workdrive_Folder_ID;
	// 	folderId = "a5rv6835432a83a614982a0707cc866fa95dc";
	if(folderId.isEmpty())
	{
		createFolder = zoho.workdrive.createFolder(subFolderName,parentFolder,"zoho_workdrive_connection");
		if(createFolder.containKey("data"))
		{
			folderId = createFolder.get("data").get("id");
			oneRec.Workdrive_Folder_ID=folderId;
		}
	}
	if(!folderId.isEmpty())
	{
		try 
		{
			uploadFile = zoho.workdrive.uploadFile(pdf,folderId,fileName,false,"zoho_workdrive_connection");
			info uploadFile;
			if(uploadFile.get("data") != null)
			{
				respData = uploadFile.get("data");
				// 			info respData;
				l = respData.get(0);
				// 			info l;
				attri = l.get("attributes");
				// 			info attri;
				rcId = attri.get("resource_id");
				// 				info rcId;
				oneRec.File_Resource_Id=rcId;
			}
		}		catch (err)
		{
			info err;
		}
	}
	// test email to Research team
	// 	sendmail
	// 	[
	// 		from :"rms@enamamc.com"
	// 		to :"abhishek@fristinetech.com"
	// 		subject :"Test Record PDF"
	// 		message :pdf
	// 		Attachments :file:fileResp
	// 	]
}
