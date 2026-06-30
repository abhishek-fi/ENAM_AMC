// Created or Edited - User input of Company / Sector? - FI_AB Type based layout rules
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
