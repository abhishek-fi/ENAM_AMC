// Created or Edited - Validations on form submission - FI_AB Submit it as Stored
// if(input.Manual_Edit_Flag == true)
// {
validationPass = true;
invalidList = "\n";
if(input.Meet_Note == "" || input.Company_Sector == "" || input.Company_Sector == null)
{
	validationPass = false;
	if(input.Company_Sector == "" || input.Company_Sector == null)
	{
		invalidList = invalidList + "Company/Sector?";
	}
	if(input.Meet_Note == "")
	{
		invalidList = invalidList + "\nMeet Note";
	}
}
if(input.Company_Sector == "Company")
{
	if(input.Company_Name == null || input.Recommendation == "" || input.Recommendation == null || input.Event_update == "" || input.Event_update == null || input.Portfolio_Stock == "" || input.Portfolio_Stock == null || input.New_Ideas == "" || input.New_Ideas == null || input.Topic_Header == "" || Outlook_View == "")
	{
		validationPass = false;
	}
	if(input.Company_Name == null)
	{
		invalidList = invalidList + "\nCompany Name";
	}
	if(input.Recommendation == "" || input.Recommendation == null)
	{
		invalidList = invalidList + "\nRecommendation";
	}
	if(input.Event_update == "" || input.Event_update == null)
	{
		invalidList = invalidList + "\nEvent Update";
	}
	if(input.Portfolio_Stock == "" || input.Portfolio_Stock == null)
	{
		invalidList = invalidList + "\nPortfolio Stock";
	}
	if(input.New_Ideas == "" || input.New_Ideas == null)
	{
		invalidList = invalidList + "\nNew Ideas";
	}
	if(input.Topic_Header == "")
	{
		invalidList = invalidList + "\nTopic Header";
	}
	if(input.Outlook_View == "")
	{
		invalidList = invalidList + "\nOutlook View";
	}
	if(input.Price_as_on != null)
	{
		if(input.Target_price == 0 || input.Target_price == null)
		{
			validationPass = false;
			invalidList = invalidList + "\nTarget Price";
		}
	}
}
if(input.Company_Sector == "Sector")
{
	if(input.Sector_Name == null || input.Event_update == "" || input.New_Ideas == "" || input.New_Ideas == null || input.Topic_Header == "" || input.Tag == "" || Outlook_View == "")
	{
		validationPass = false;
	}
	if(input.Sector_Name == null)
	{
		invalidList = invalidList + "\nSector Name";
	}
	if(input.Event_update == "" || input.Event_update == null)
	{
		invalidList = invalidList + "\nEvent Update";
	}
	if(input.New_Ideas == "" || input.New_Ideas == null)
	{
		invalidList = invalidList + "\nNew Ideas";
	}
	if(input.Topic_Header == "")
	{
		invalidList = invalidList + "\nTopic Header";
	}
	if(input.Tag == "")
	{
		invalidList = invalidList + "\nTag";
	}
	if(input.Outlook_View == "")
	{
		invalidList = invalidList + "\nOutlook View";
	}
}
if(validationPass == true)
{
	input.Ready_to_Submit = true;
}
// }
