string FI_AB_Get_Current_FY()
{
	dateVal = zoho.currentdate;
	// or input.Date_Field
	month = dateVal.getMonth();
	year = dateVal.getYear();
	// ---- Determine Current Quarter ----
	if(month >= 4 && month <= 6)
	{
		currentQ = 1;
	}
	else if(month >= 7 && month <= 9)
	{
		currentQ = 2;
	}
	else if(month >= 10 && month <= 12)
	{
		currentQ = 3;
	}
	else
	{
		currentQ = 4;
	}
	// ---- Determine Current FY ----
	if(month >= 4)
	{
		fy = year + 1;
	}
	else
	{
		fy = year;
	}
	// ---- Get Previous Quarter ----
	if(currentQ == 1)
	{
		prevQ = 4;
		fy = fy - 1;
		// move to previous FY
	}
	else
	{
		prevQ = currentQ - 1;
	}
	// ---- Format Output ----
	result = "Q" + prevQ + "FY" + fy.toString().right(2);
	info result;
	return result;
}
