void automation.FI_AB_Bank_Verification_OB(Int recId)
{
recData = zoho.crm.getRecordById("Onboarding",recId);
if(recData != null)
{
	accountNo = recData.get("Account_No");
	ifsc = recData.get("IFSC_Code");
	BankAccountName = recData.get("Name");
	if(accountNo != null && ifsc != null)
	{
		mp = Map();
		mp.put("beneficiary_account_no",accountNo);
		mp.put("beneficiary_ifsc",ifsc);
		mp.put("unique_request_id",zoho.currenttime.toLong());
		mp.put("beneficiary_name",BankAccountName);
		mp.put("validation_mode","PENNY_LESS");
		info mp;
		resp = invokeurl
		[
			url :"https://ext.digio.in:444/v4/client/verify/bank_account"
			type :POST
			parameters:mp.toString()
			headers:{"Authorization":"Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=","Content-Type":"application/json"}
		];
		info resp;
		if(resp.get("verified") != null && resp.get("verified") == true)
		{
			msg = "Pennyless verification successful.";
			info msg;
			iMap = {"Bank_Details_Verified":true};
			zoho.crm.updateRecord("Onboarding",recId,iMap);
			createCall = standalone.FI_AB_Create_Bank_Account_Record(recId);
			info createCall;
		}
		else
		{
			info "INVALID";
		}
	}
	else
	{
		msg = "Account No/IFSC missing.";
		info msg;
	}
}
}
