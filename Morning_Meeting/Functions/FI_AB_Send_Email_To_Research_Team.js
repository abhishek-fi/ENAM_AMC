void FI_AB_Send_Email_To_Research_Team(string pdfUrl)
{
	try 
	{
		fileResp = invokeurl
		[
			url :pdfUrl
			type :GET
		];
	}	catch (err)
	{
		info err;
	}
	//
	currDate = zoho.currentdate;
	subject = "Morning Meeting Note – " + zoho.currentdate;
	content = "Dear All, <br><br>Kindly find attached, the topics discussed in today’s Morning Meeting.";
	// 	content = content + "Kindly find attached the topics discussed in today’s morning meeting.<br>";
	//
	notes_list = Morning_Notes[Submission_Date_Time < zoho.currenttime && Submission_Date_Time > zoho.currenttime.subBusinessDay(1) && Record_Status1 == "Stored"];
	info notes_list;
	try 
	{
		currFy = thisapp.FI_AB_Get_Current_FY();
	}	catch (err)
	{
		currFy = "";
		info err;
	}
	// Initialize empty strings
	resultEvent = "";
	businessUpdate = "";
	newIdeas = "";
	// Section headers (used for comparison later)
	resultHeader = "<b>" + currFy + " Results</b><br><ul style='margin-top:0px; margin-bottom:10px;'>";
	businessHeader = "<b>Business Update</b><br><ul style='margin-top:0px; margin-bottom:10px;'>";
	newIdeasHeader = "<b>New Ideas Update</b><br><ul style='margin-top:0px; margin-bottom:10px;'>";
	// Temporary builders
	resultEventTemp = resultHeader;
	businessUpdateTemp = businessHeader;
	newIdeasTemp = newIdeasHeader;
	// Loop through notes
	for each  note in notes_list
	{
		if(note.Event_update == "Result Update" && note.Company_Name != null)
		{
			companyName = Company_Universe[ID == note.Company_Name].Company_Name;
			resultEventTemp = resultEventTemp + "<li>" + companyName + "</li>";
		}
		else if(note.Event_update == "Business Update")
		{
			if(note.New_Ideas == "Yes")
			{
				newIdeasTemp = newIdeasTemp + "<li>" + note.Topic_Header + "</li>";
			}
			else
			{
				businessUpdateTemp = businessUpdateTemp + "<li>" + note.Topic_Header + "</li>";
			}
		}
	}
	// Finalize sections only if items exist
	if(resultEventTemp != resultHeader)
	{
		resultEvent = resultEventTemp + "</ul>";
	}
	if(businessUpdateTemp != businessHeader)
	{
		businessUpdate = businessUpdateTemp + "</ul>";
	}
	if(newIdeasTemp != newIdeasHeader)
	{
		newIdeas = newIdeasTemp + "</ul>";
	}
	// Footer
	footer = "Regards,<br>ENAM AMC Research team";
	// Build email body
	emailBody = content + "<br><br>";
	// Add sections (clean spacing)
	if(resultEvent != "")
	{
		emailBody = emailBody + resultEvent;
	}
	if(businessUpdate != "")
	{
		emailBody = emailBody + "<br>" + businessUpdate;
	}
	if(newIdeas != "")
	{
		emailBody = emailBody + "<br>" + newIdeas;
	}
	// Add footer
	emailBody = emailBody + "<br><br>" + footer;
	//
	// 	testList=["abhishek@fristinetech.com","abhishek@fristinetech.com"];
	if(zoho.appuri.contains("environment"))
	{
		sendToList = {"abhishek@fristinetech.com","parth@fristinetech.com"};
	}
	else
	{
		// 		sendToList = {"abhishek@fristinetech.com"};
		sendToList = "wally.fernandes@enamamc.com";
	}
	// 	info sendToList;
	info emailBody;
	currDate = zoho.currentdate;
	formattedDate = currDate.toString("dd MMMM yyyy");
	fileName = formattedDate + " Morning Meeting.pdf";
	fileResp.setFileName(fileName);
	info fileResp;
	sendmail
	[
		from :"rms@enamamc.com"
		to :sendToList
		subject :subject
		message :emailBody
		Attachments :file:fileResp
	]
	sendmail
	[
		from :"rms@enamamc.com"
		to :"abhishek@fristinetech.com","parth@fristinetech.com"
		subject :subject
		message :emailBody
		Attachments :file:fileResp
	]
}
