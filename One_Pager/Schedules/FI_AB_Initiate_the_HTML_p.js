// On 26-Apr-2026 - At 20:36:00 Daily - FI_AB Initiate the HTML process
// should be configured monthly 
// Get current date-time
current_date = zoho.currenttime;
// Step 1: First day of current month
first_day_current_month = current_date.toStartOfMonth();
// Step 2: Last day of previous month
last_day_prev_month = first_day_current_month.addDay(-1);
// Step 3: First day of previous month
first_day_prev_month = last_day_prev_month.toStartOfMonth();
// Optional: Set time boundaries
start_datetime = first_day_prev_month.toDate().toString("yyyy-MM-dd") + " 00:00:00";
end_datetime = last_day_prev_month.toDate().toString("yyyy-MM-dd") + " 23:59:59";
// Convert to datetime format
start_datetime = start_datetime.toTime();
end_datetime = end_datetime.toTime();
// Fetch records
onePagerList = One_Page_Module[Submitted_Date >= start_datetime && Submitted_Date <= end_datetime && Status == "Submitted"];
///////// ***************************** MAKE SURE THIS IS ENABLED *****************************                                            ********************* ////////////////////////////////////////
// onePagerList = One_Page_Module[ID != 0 && Bloomberg_Ticker != ""]; //Used for testing
// recId = 
//     recData = One_Page_Module[ID == recId];
//     bTicker = recData.Bloomberg_Ticker;
// token = thisapp.getAccessToken_FI_AB();
// token = "1000.9649e83cd62c8d929806efbc7db3ae9a.4e4f376e6d9b07b38214f34ea732e7e3";
// info token;
for each  rec in onePagerList
{
	recId = rec.ID;
	info recId;
	try 
	{
		thisapp.GetExcelFileCovertToSheetAndRead(recId);
	}	catch (err)
	{
		sendmail
		[
			from :zoho.adminuserid
			to :"abhishek@fristinetech.com","parth@fristinetech.com"
			subject :"Generating price table for one pager failed"
			message :err
		]
	}
	try 
	{
		thisapp.FI_AB_One_Pager_Static_HTML(recId);
	}	catch (err)
	{
		sendmail
		[
			from :zoho.adminuserid
			to :"abhishek@fristinetech.com","parth@fristinetech.com"
			subject :"Generate one pager failed"
			message :err
		]
	}
}
