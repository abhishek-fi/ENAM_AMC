// On 25-May-2026 - At 09:30:00 Monthly - One Pager Reminder
today = zoho.currentdate;
startOfMonth = today.toStartOfMonth();
endOfMonth = today.eomonth(0);
analysts = User_Master[Profile == "Analyst" && User_Status == "Active"];
analystsWithoutOnePager = List();
for each  analyst in analysts
{
	onePagerCount = One_Page_Module[Analyst == analyst.ID && Added_Time >= startOfMonth && Added_Time <= endOfMonth].count();
	if(onePagerCount == 0)
	{
		analystsWithoutOnePager.add(analyst);
	}
}
/* Send reminder emails */
for each  analyst in analystsWithoutOnePager
{
	analystRec = User_Master[ID == analyst];
	info analystRec.Full_Name;
	if(analystRec.Email_Id != null)
	{
		sendmail
		[
			from :"rms@enamamc.com"
			to :analystRec.Email_Id
			subject :"Reminder: Please add your one-pager for this month"
			message :"Hi " + analystRec.First_Name + " " + analystRec.Last_Name + ",<br><br>" + "This is a gentle reminder to add your one-pager for the current month.<br><br>" + "Thanks,<br>" + "ENAM Research Team"
		]
	}
}
