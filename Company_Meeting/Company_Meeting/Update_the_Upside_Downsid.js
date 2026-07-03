// Company Meeting - Created or Edited - User input of Return (%) - Update the Upside Downside Field
returnPercent = input.Return_Percent;
if(returnPercent <= 0)
{
	input.Upside_Downside = "Downside";
}
else if(returnPercent > 0)
{
	input.Upside_Downside = "Upside";
}
