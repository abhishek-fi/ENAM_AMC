// Company Meeting - Created or Edited - User input of Company Name - Fetch Closing Price and SEDOL of the Company
companyISIN = Company_Universe[ID == input.Company_Name].CD_ISIN_No;
sedol = Company_Universe[ID == input.Company_Name].SEDOL;
enable SEDOL;
input.SEDOL = sedol;
disable SEDOL;
priceMaster = Price_Master[CD_ISIN_No == companyISIN].Closing_Price;
input.Closing_Price = ifNull(priceMaster,0.00);
disable Closing_Price;
