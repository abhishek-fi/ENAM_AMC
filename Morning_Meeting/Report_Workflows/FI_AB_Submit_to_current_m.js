// Morning Notes - In My Drafts - On click of action item: Submit Note - FI_AB Submit to current meeting
info "Submission initiated..";
validationPass = true;
if(input.Meet_Note == "")
{
	validationPass = false;
}
else if(input.Company_Sector == "Company")
{
	if(input.Company_Name == null || input.Recommendation == "" || input.Event_update == "" || input.Portfolio_Stock == "" || input.New_Ideas == "" || input.Topic_Header == "" || Outlook_View == "")
	{
		validationPass = false;
	}
	if(input.Price_as_on != null && input.Target_price == 0)
	{
		validationPass = false;
	}
}
else if(input.Company_Sector == "Sector")
{
	if(input.Sector_Name == null || input.Event_update == "" || input.New_Ideas == "" || input.Topic_Header == "" || input.Tag == "" || Outlook_View == "")
	{
		validationPass = false;
	}
}
if(validationPass == false)
{
	info "Please fill all the mandatory fields!";
}
else if(validationPass == true)
{
	currTime = zoho.currenttime;
	if(currTime.getHour() >= 11 && currTime.getMinutes() >= 30)
	{
		// 	in\fo "going to get tomorrow meeting";
		todayMeeting = Meeting_Details[Meeting_Date == zoho.currentdate.addDay(1)];
	}
	else
	{
		todayMeeting = Meeting_Details[Meeting_Date == zoho.currentdate];
	}
	mId = todayMeeting.ID;
	// info "Today meeting: "+ mId.toString();
	if(mId != null)
	{
		masterRec = Morning_Meeting_Notes_Master[Meeting_Detail == mId];
		if(masterRec.count(ID) == 0)
		{
			// 		info "Creating New Master";
			masterId = insert into Morning_Meeting_Notes_Master
			[
				Added_User=zoho.loginuser
				Meeting_Detail=mId
			];
			masterRec = Morning_Meeting_Notes_Master[ID == masterId];
		}
		else
		{
			masterId = masterRec.ID;
		}
		// 	info "Master ID: "+masterId.toString();
		morningMeetRec = Morning_Meeting_Notes[Meeting_Detail == mId && Analyst == Analyst];
		if(morningMeetRec.count(ID) == 0)
		{
			// 		info "Creating New Morning Meeting Record";
			mmId = insert into Morning_Meeting_Notes
			[
				Added_User=zoho.loginuser
				Meeting_Detail=mId
			];
		}
		else
		{
			mmId = morningMeetRec.ID;
		}
		// 	info "MM ID: "+mmId.toString();
		input.Meeting_Detail = mId;
		input.Morning_Meeting_Notes = mmId;
		input.Morning_Meeting_Notes_Master = masterId;
		input.Record_Status1 = "Stored";
		input.Submission_Date_Time = zoho.currenttime;
		input.Edit_Access = true;
		info "Note: " + input.Topic_Header + " was successfully submitted!";
	}
}
