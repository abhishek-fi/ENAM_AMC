// Company Meeting - Edited - Load of the form - Populate closing price of company
companyISIN = Company_Universe[ID == input.Company_Name].CD_ISIN_No;
priceMaster = Price_Master[CD_ISIN_No == companyISIN].Closing_Price;
input.Closing_Price = ifNull(priceMaster,0.00);
disable Closing_Price;
