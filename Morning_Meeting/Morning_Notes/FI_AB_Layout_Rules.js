// Created or Edited - Load of the form - FI_AB Layout Rules
disable Analyst;
input.Manual_Edit_Flag = true;
if(input.Analyst == null)
{
	input.Analyst = User_Master[Email_Id = zoho.loginuserid].ID;
}
if(input.Company_Sector == "Company")
{
	show Company_Name;
	show Recommendation;
	show Event_update;
	show Portfolio_Stock;
	show New_Ideas;
	show Topic_Header;
	show Outlook_View;
	show Price_as_on;
	show Target_price;
	// 	show input.Return_field;
	hide Tag;
	hide Sector_Name;
}
else if(input.Company_Sector == "Sector")
{
	show Sector_Name;
	show Event_update;
	show New_Ideas;
	show Topic_Header;
	show Tag;
	show Outlook_View;
	hide Company_Name;
	hide Recommendation;
	hide Portfolio_Stock;
	hide Price_as_on;
	hide Target_price;
	// 	hide input.Return_field;
}
if(input.Company_Name != null)
{
	comp = Company_Universe[ID == input.Company_Name];
	if(comp.Part_of_Folio == "Yes")
	{
		input.Portfolio_Stock = "Yes";
		disable Portfolio_Stock;
	}
	priceRec = Price_Master[Company_Name == input.Company_Name];
	if(priceRec.count(ID) > 0)
	{
		input.Price_as_on = priceRec.Closing_Price;
		disable Price_as_on;
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
