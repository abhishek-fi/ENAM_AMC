string FI_AB_Update_Attendance(string recID, string mode, string doesJoin, string reasonNotAttend)
{
	id = recID.toLong();
	rec = Morning_Meeting_Attendance[ID == id];
	if(rec.count() > 0)
	{
		if(mode == "offline")
		{
			rec.Mode="Conference Room";
			rec.Will_you_be_able_to_join_tomorrow="Yes";
		}
		else if(mode == "online")
		{
			rec.Mode="MS Teams";
			rec.Will_you_be_able_to_join_tomorrow="Yes";
		}
		else
		{
			rec.Will_you_be_able_to_join_tomorrow="No";
			rec.Not_attended_reason=reasonNotAttend;
		}
		return "success";
	}
	return "failed";
}
