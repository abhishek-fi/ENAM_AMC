void automation.FI_AB_Update_Owner_as_Maker(Int recId)
{
onboarding_details = zoho.crm.getRecordById("Onboarding",recId);
// 	info onboarding_details;
owner = ifnull(onboarding_details.get("Owner"),"");
info owner;
if(owner != "" && owner != null)
{
	iMap = Map();
	iMap.put("Maker",owner);
	info iMap;
	updateResp = zoho.crm.updateRecord("Onboarding",recId,iMap);
	info updateResp;
}
else
{
	info "Owner fetching failled";
}
}
