void automation.FI_AB_Update_Holders_PAN_Verification_status(Int recordid)
{
msg = "";
Pandata = zoho.crm.getRecordById("Onboarding",recordid);
layout = Pandata.get("Layout").get("name");
updateMap = Map();
if(Pandata != null)
{
	panvalue = Pandata.get("PAN");
	//info panvalue ;
	if(panvalue != null)
	{
		if(layout == "Non - Individual")
		{
			mp = {"id_no":panvalue};
			resp = invokeurl
			[
				url :"https://ext.digio.in:444/client/v4/apis/kyc/fetch_id_data/PAN"
				type :POST
				parameters:mp.toString()
				headers:{"Authorization":"Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=","Content-Type":"application/json"}
			];
			info resp;
			if(resp.get("status") == "VALID")
			{
				updateMap.put("PAN_Verified",true);
			}
		}
		else
		{
			mp = {"name":Pandata.get("Name"),"dob":Pandata.get("FH_Date_of_Birth").toString("dd/MM/yyy")};
			mp.put("id_no",panvalue);
			resp = invokeurl
			[
				url :"https://ext.digio.in:444/client/v4/apis/kyc/fetch_id_data/PAN"
				type :POST
				parameters:mp.toString()
				headers:{"Authorization":"Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=","Content-Type":"application/json"}
			];
			info resp;
			if(resp != null)
			{
				status = resp.get("status");
				if(status != null && status.contains("valid"))
				{
					msg = status;
					updateMap.put("PAN_Verified",true);
					if(resp.get("aadhaar_seeding_status") == "y")
					{
						updateMap.put("PAN_Aadhaar_Seeding_Verified",true);
					}
				}
				else
				{
					msg = "Please enter Valid PAN Number.";
				}
			}
		}
		info updateMap;
	}
	panvalue2 = Pandata.get("PAN1");
	//info panvalue2 ;
	if(panvalue2 != null)
	{
		mp = {"name":Pandata.get("Name_of_Applicant1"),"dob":Pandata.get("FH_Date_of_Birth1").toString("dd/MM/yyy")};
		mp.put("id_no",panvalue2);
		resp = invokeurl
		[
			url :"https://ext.digio.in:444/client/v4/apis/kyc/fetch_id_data/PAN"
			type :POST
			parameters:mp.toString()
			headers:{"Authorization":"Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=","Content-Type":"application/json"}
		];
		info resp;
		if(resp != null)
		{
			status = resp.get("status");
			if(status != null && status.contains("valid"))
			{
				msg = status;
				updateMap.put("SH_PAN_Verified",true);
				if(resp.get("aadhaar_seeding_status") == "y")
				{
					updateMap.put("SH_PAN_Aadhaar_Seeding_Verified",true);
				}
			}
			else
			{
				msg = "Please enter Valid PAN Number.";
			}
		}
	}
	panvalue3 = Pandata.get("PAN2");
	//info panvalue3 ;
	if(panvalue3 != null)
	{
		mp = {"name":Pandata.get("Name_of_Applicant2"),"dob":Pandata.get("FH_Date_of_Birth2").toString("dd/MM/yyy")};
		mp.put("id_no",panvalue3);
		resp = invokeurl
		[
			url :"https://ext.digio.in:444/client/v4/apis/kyc/fetch_id_data/PAN"
			type :POST
			parameters:mp.toString()
			headers:{"Authorization":"Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=","Content-Type":"application/json"}
		];
		info resp;
		if(resp != null)
		{
			status = resp.get("status");
			if(status != null && status.contains("valid"))
			{
				msg = status;
				updateMap.put("TH_PAN_Verified",true);
				if(resp.get("aadhaar_seeding_status") == "y")
				{
					updateMap.put("TH_PAN_Aadhaar_Seeding_Verified",true);
				}
			}
			else
			{
				msg = "Please enter Valid PAN Number.";
			}
		}
	}
	if(updateMap.isEmpty() == false)
	{
		res = zoho.crm.updateRecord("Onboarding",recordid.toLong(),updateMap);
		info res;
	}
}
}
