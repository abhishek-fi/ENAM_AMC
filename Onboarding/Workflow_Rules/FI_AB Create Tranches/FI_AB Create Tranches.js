void automation.FI_AB_Create_Tranches(Int recordId)
{
// Fetch onboarding record
onboardInfo = zoho.crm.getRecordById("Onboarding",recordId);
if(onboardInfo != null)
{
	owner = onboardInfo.get("Owner");
	noOfTranches = ifnull(onboardInfo.get("No_of_Tranches"),0);
	investmentAmount = ifnull(onboardInfo.get("Investment_Amount"),0);
	planDate = ifnull(onboardInfo.get("Systematic_Transfer_PlanDate"),"");
	currDate = null;
	//Initial_Amount
	initialAmount = ifnull(onboardInfo.get("Initial_Amount"),0);
	if(initialAmount != 0)
	{
		investmentAmount = investmentAmount - initialAmount;
	}
	if(noOfTranches > 0 && investmentAmount > 0 && recordId != null)
	{
		// Check existing tranches to avoid duplicates
		existingTranches = zoho.crm.getRelatedRecords("Tranches","Onboarding",recordId);
		if(existingTranches.size() == 0)
		{
			// Calculate base amount and remainder
			baseAmount = (investmentAmount / noOfTranches).toLong();
			// integer division
			remainder = investmentAmount % noOfTranches;
			// Tranche names
			trancheNames = {"1st Tranche","2nd Tranche","3rd Tranche","4th Tranche","5th Tranche","6th Tranche"};
			count = 0;
			for each  trancheName in trancheNames
			{
				if(planDate != "")
				{
					currDate = planDate.addMonth(count);
				}
				count = count + 1;
				if(count <= noOfTranches)
				{
					trancheMap = Map();
					trancheMap.put("Applicant_Name",recordId);
					trancheMap.put("Name",trancheName);
					trancheMap.put("Owner",owner);
					if(currDate != null)
					{
						trancheMap.put("Date",currDate);
					}
					// Distribute remainder across the first 'remainder' tranches
					if(count <= remainder)
					{
						trancheMap.put("Amount",baseAmount + 1);
					}
					else
					{
						trancheMap.put("Amount",baseAmount);
					}
					info trancheName;
					createTranche = zoho.crm.createRecord("Tranches",trancheMap);
					info createTranche;
				}
			}
		}
	}
}
}
