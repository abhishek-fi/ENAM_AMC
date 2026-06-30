// Created or Edited - User input of Company Name - FI_AB populate company details
if(input.Company_Name != null)
{
	comp = Company_Universe[ID == input.Company_Name];
	if(comp.Analyst2 != null)
	{
		input.Analyst = comp.Analyst2;
	}
	if(comp.Part_of_Folio == "Yes")
	{
		input.Portfolio_Stock = "Yes";
		// 		disable Portfolio_Stock;
	}
	else
	{
		enable Portfolio_Stock;
	}
	priceRec = Price_Master[Company_Name == input.Company_Name];
	if(priceRec.count(ID) > 0)
	{
		input.Price_as_on = priceRec.Closing_Price;
		disable Price_as_on;
		enable Target_price;
		enable Recommendation;
		enable Portfolio_Stock;
	}
	else
	{
		input.Price_as_on = null;
		input.Portfolio_Stock = "No";
		input.Recommendation = "Not Rated";
		input.Target_price = 0;
		disable Target_price;
		disable Recommendation;
		disable Portfolio_Stock;
	}
}
