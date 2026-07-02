// Morning Meeting Notes - Based on Added Time - FI_AB Add to Not Attended List in Master
if(input.Have_you_attended_today_s_meeting == "No" && input.Meeting_Detail != null)
{
	masterRec = Morning_Meeting_Notes_Master[Meeting_Detail == input.Meeting_Detail];
	if(masterRec.count() == 0)
	{
		masterId = insert into Morning_Meeting_Notes_Master
		[
			Added_User=zoho.loginuser
			Meeting_Detail=input.Meeting_Detail
		];
		masterRec = Morning_Meeting_Notes_Master[ID == masterId];
	}
	for each  rec in masterRec
	{
		tempsList = Collection();
		tempsList.insertall(rec.Not_Attended_List);
	}
	// 	existingList=masterRec.Not_Attended_List.getal();
	tempsList.insert(input.ID);
	masterRec.Not_Attended_List=tempsList;
}
