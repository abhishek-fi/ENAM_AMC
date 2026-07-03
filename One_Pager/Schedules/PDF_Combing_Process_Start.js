// On 26-Apr-2026 - At 20:10:00 Daily - PDF_Combing_Process_Start
// should be monthly
current_date = zoho.currenttime;
first_day_current_month = current_date.toStartOfMonth();
last_day_prev_month = first_day_current_month.addDay(-1);
first_day_prev_month = last_day_prev_month.toStartOfMonth();
start_datetime = (first_day_prev_month.toDate().toString("yyyy-MM-dd") + " 00:00:00").toTime();
end_datetime = (last_day_prev_month.toDate().toString("yyyy-MM-dd") + " 23:59:59").toTime();
monthYearCode = first_day_prev_month.toDate().toString("MMM-yyyy");
info "Running combine for Month_Year_Code = " + monthYearCode;
existing = One_Pager_Report[Month_Year_Code == monthYearCode];
if(existing.count() == 0)
{
	newRec = insert into One_Pager_Report
	[
		Added_User=zoho.loginuser
		Month_Year_Code=monthYearCode
	];
}
onePagerList = One_Page_Module[Added_Time >= start_datetime && Added_Time <= end_datetime && Status == "Submitted"];
recordIdList = list();
for each  rec in onePagerList
{
	recordIdList.add(rec.ID);
}
totalRecords = recordIdList.size();
info "Total records to process: " + totalRecords;
if(totalRecords == 0)
{
	info "No records found for " + monthYearCode + ". Exiting.";
	return;
}
batchSize = 20;
batchNumber = 1;
currentBatch = list();
counter = 0;
for each  recId in recordIdList
{
	currentBatch.add(recId);
	counter = counter + 1;
	isLastRecord = counter == totalRecords;
	if(currentBatch.size() == batchSize || isLastRecord)
	{
		info "Processing batch " + batchNumber + " with " + currentBatch.size() + " records";
		thisapp.Initiate_PDF_Combining(currentBatch,batchNumber,monthYearCode);
		batchNumber = batchNumber + 1;
		currentBatch = list();
	}
}
info "All batches dispatched for " + monthYearCode;
