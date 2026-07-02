// On 07-Jan-2026 - At 11:30:00 daily - FI_AB Disable edit access flag
today = zoho.currentdate;
todayMeeting = Meeting_Details[Meeting_Date == today];
mId = todayMeeting.ID;
notes = Morning_Notes[Meeting_Detail == mId && Record_Status1 == "Stored"];
for each  note in notes
{
	note.Edit_Access=false;
}
