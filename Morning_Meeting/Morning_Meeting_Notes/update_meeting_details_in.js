// Created or Edited - Successful form submission -update meeting details in subfrom
meeting = Meeting_Details[ID == input.Meeting_Detail];
info meeting;
for each  row in meeting.Analyst_Meeting_Attendance
{
	if(row.Analyst_Name.ID == input.Analyst.ID)
	{
		row.Have_you_attended_today_s_meeting=input.Have_you_attended_today_s_meeting;
		row.Mode=input.Mode;
		row.Attended_Mode=input.Mode;
		row.Not_Attended_Reason=input.Not_attended_reason;
		row.update(meeting,meeting.Analyst_Meeting_Attendance);
		break;
	}
}
thisapp.workflow_test();
