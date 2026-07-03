// On 24-Dec-2025 - At 08:00:00 Daily - Company Universe CSV Data Scheduler
fileId = "mp02116163d97bf8b46bba90b38c2a8e6a48a";
fileresponse = invokeurl
[
	url :"https://download.zoho.in/v1/workdrive/download/" + fileId
	type :GET
	connection:"zoho_workdrive_connection"
];
//info fileresponse;
new_row = fileresponse.toString().toList("\n");
//info new_row ;
newrowsize = new_row.size();
info newrowsize;
liced_list = new_row.subList(2,newrowsize);
//info liced_list ;
for each  new_var in liced_list
{
	new_column = new_var.toList(",");
	// info new_column ;
	isin_no = new_column.get(6);
	// info isin_no;
	if(!isin_no.isEmpty())
	{
		company_name = new_column.get(1);
		//info company_name ;
		isinrecords = Company_Universe[CD_ISIN_No == isin_no];
		//info isinrecords;
		SC_NSE_52_Wk_High_Price = new_column.get(10);
		// info SC_NSE_52_Wk_High_Price ;
		SC_NSE_52_Wk_Low_Price = new_column.get(11);
		// info SC_NSE_52_Wk_Low_Price;
		NDP_Close = new_column.get(7);
		//companyid = Company_Universe[CD_ISIN_No == isin_no].ID;
		//companyPrice = Price_Master[Company_Name == company_name];
		if(isinrecords.count(ID) > 0)
		{
			//Update code
			for each  each_red in isinrecords
			{
				//info each_red;
				each_red.week_High_Date_amount=SC_NSE_52_Wk_High_Price;
				each_red.week_Low_Date_amount=SC_NSE_52_Wk_Low_Price;
				each_red.Closing_Price=NDP_Close;
			}
		}
		else
		{
			//Create code
			createRecord = insert into Company_Universe
			[
				Company_Name=company_name
				Closing_Price=NDP_Close
				week_High_Date_amount=SC_NSE_52_Wk_High_Price
				week_Low_Date_amount=SC_NSE_52_Wk_Low_Price
				CD_ISIN_No=isin_no
				Added_User=zoho.loginuser
			];
		}
	}
}
