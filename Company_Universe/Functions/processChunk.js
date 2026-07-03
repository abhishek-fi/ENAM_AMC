void processChunk(list chunkRows, int startIndex, int endIndex, string mode)
{
	for each  row in chunkRows
	{
		if(row == null || row.isEmpty())
		{
			continue;
		}
		values = row.toList(",");
		if(values.size() <= 6)
		{
			continue;
		}
		Sheet_ISIN_No = values.get(6);
		if(Sheet_ISIN_No == null || Sheet_ISIN_No.isEmpty())
		{
			continue;
		}
		if(mode == "company")
		{
			cuRec = Company_Universe[CD_ISIN_No == Sheet_ISIN_No];
			if(cuRec.CD_ISIN_No != null)
			{
				cuRec.CD_Bloomberg_Code=if(!isEmpty(values.get(4)),values.get(4),null);
				cuRec.Company_Name=values.get(1);
				cuRec.week_High_Date_amount=if(!isEmpty(values.get(10)),values.get(10),null);
				cuRec.week_Low_Date_amount=if(!isEmpty(values.get(11)),values.get(11),null);
				cuRec.Closing_Price=if(!isEmpty(values.get(7)),values.get(7),null);
				if(cuRec.Company_Name != values.get(1))
				{
					info "Name mismatch for ISIN: " + Sheet_ISIN_No + " Existing: " + cuRec.Company_Name + " Incoming: " + values.get(1);
				}
			}
			else
			{
				insert into Company_Universe
				[
					CD_Bloomberg_Code=if(!isEmpty(values.get(4)),values.get(4),null)
					Company_Name=values.get(1)
					CD_ISIN_No=Sheet_ISIN_No
					week_High_Date_amount=if(!isEmpty(values.get(10)),values.get(10),null)
					week_Low_Date_amount=if(!isEmpty(values.get(11)),values.get(11),null)
					Closing_Price=if(!isEmpty(values.get(7)),values.get(7),null)
					Added_User=zoho.adminuser
				]
			}
		}
		else if(mode == "price")
		{
			cuRec = Company_Universe[CD_ISIN_No == Sheet_ISIN_No];
			pmRec = Price_Master[CD_ISIN_No == Sheet_ISIN_No];
			info values.get(10);
			if(pmRec.Company_Name == cuRec.ID)
			{
				pmRec.Week_High=if(!isEmpty(values.get(10)),values.get(10),null);
				pmRec.Week_Low=if(!isEmpty(values.get(11)),values.get(11),null);
				pmRec.Closing_Price=if(!isEmpty(values.get(7)),values.get(7),null);
			}
			else
			{
				insert into Price_Master
				[
					Company_Name=cuRec.ID
					CD_ISIN_No=Sheet_ISIN_No
					Week_High=if(!isEmpty(values.get(10)),values.get(10),null)
					Week_Low=if(!isEmpty(values.get(11)),values.get(11),null)
					Closing_Price=if(!isEmpty(values.get(7)),values.get(7),null)
					Added_User=zoho.adminuser
				]
			}
		}
	}
	info "Processed " + mode + " rows from " + startIndex + " to " + endIndex;
}
