// Created or Edited - Successful form submission - data populate in meeting details subfrom
meeting = Meeting_Details[ID == input.Meeting_Detail];
info meeting;
for each  row in meeting.Analyst_Meeting_Attendance
{
	if(row.Analyst_Name.ID == input.Analyst_Name.ID)
	{
		row.Analyst_Name=input.Analyst_Name;
		row.Invited=input.Meeting_Invite_Response_Status;
		row.Will_you_be_able_to_join_tomorrow_s_meeting=input.Will_you_be_able_to_join_tomorrow;
		row.Mode=input.Mode;
		row.update(meeting,meeting.Analyst_Meeting_Attendance);
		info "Row updated for: " + input.Analyst_Name.toString();
		break;
	}
}
