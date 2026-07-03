void automation.FI_AB_Create_STP_Task(Int recId)
{
assoTranches = zoho.crm.getRelatedRecords("Tranches","Onboarding",recId);
info assoTranches;
for each  t in assoTranches
{
	iMap = Map();
	iMap.put("$se_module","Tranches");
	iMap.put("Owner",t.get("Owner"));
	iMap.put("Subject",t.get("Name"));
	iMap.put("Due_Date",t.get("Date"));
	iMap.put("What_Id",t.get("id"));
	createResp = zoho.crm.createRecord("Tasks",iMap);
	info createResp;
}
}
