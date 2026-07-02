// On 26-Dec-2025 - At 11:30:30 Daily - FI_AB Generate PDF to Workdrive
// https://creatorapp.zohopublic.in"+zoho.appuri+"report-perma/Morning_Meeting_Notes_Master_Report_Templates/HD9ZJPyOszZUUhCQNaCA0tP35CGgCYGkkQ9rkMdXZvgH1S1x8C3efeqm06x3wv9y2BC223VBeqNv0mQVvv9wAMKDVWZUUJv9SQaQ
appUri = zoho.appuri;
if(appUri.contains("environment"))
{
	return;
}
thisday = zoho.currentdate;
day = thisday.getDayOfWeek();
if(day == 1 || day == 7)
{
	info "Today is weekend. Skipping.";
	return;
}
meeting = Meeting_Details[Meeting_Date == zoho.currentdate];
todayMeeting = meeting.ID;
info todayMeeting;
mainFileName = meeting.Meeting_Title.replaceAll(" ","_");
currDate = zoho.currentdate;
formattedDate = currDate.toString("dd MMMM yyyy");
fileName = formattedDate + " Morning Meeting.pdf";
encodedFileName = zoho.encryption.urlEncode(fileName);
// Debug info
info fileName;
// e.g. "13 January 2026 Morning Meeting"
info encodedFileName;
// e.g. "13%20January%202026%20Morning%20Meeting"
todayNotes = Morning_Meeting_Notes_Master[Meeting_Detail == todayMeeting];
info todayNotes;
recId = todayNotes.ID;
//
fileUrl = "https://creatorapp.zohopublic.in" + zoho.appuri + "record-pdf/Morning_Meeting_Notes_Master_Report_Templates/" + recId.toString() + "/" + mainFileName + "/gtAGJy39C4xQggja2Ahj8Df05U45TZT571s7AgYvm3BFZf5nfmzxxbdfvY07B6VBfmxwdN13pFMUpW2A4kO6bEq9kd6OO9NJsO3b";
info fileUrl;
fileResp = invokeurl
[
	url :fileUrl
	type :GET
];
info fileResp;
try 
{
	thisapp.FI_AB_Send_Email_To_Research_Team(fileUrl);
	// 	info "research team email skipped!";
}
catch (err)
{
	info err;
}
// info fileResp;
//  // Getting folder id from Master, if not available, create a folder
parentFolder = "435hha838077f173c4203ac1e201c3f8b235c";
master = Morning_Meeting_Notes_Master[Meeting_Detail == todayMeeting];
folderId = master.Workdrive_Folder_ID;
if(folderId.isEmpty())
{
	createFolder = zoho.workdrive.createFolder(meeting.Meeting_Title,parentFolder,"zoho_workdrive_connection");
	if(createFolder.containKey("data"))
	{
		folderId = createFolder.get("data").get("id");
		master.Workdrive_Folder_ID=folderId;
	}
}
if(!folderId.isEmpty())
{
	try 
	{
		uploadFile = zoho.workdrive.uploadFile(fileResp,folderId,fileName,false,"zoho_workdrive_connection");
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
			info rcId;
			meeting.File_Resource_Id=rcId;
		}
	}
	catch (err)
	{
		info err;
	}
}
// // test email to Research team
// sendmail
// [
// 	from :"rms@enamamc.com"
// 	to :"abhishek@fristinetech.com"
// 	subject :"Test Record PDF"
// 	message :"KFA"
// 	Attachments :file:fileResp
// ]
