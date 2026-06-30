// Created or Edited - Validations on form submission - set mandatory field validation
if(input.Morning_Notes.Company_Sector == "Sector")
{
	if(isNull(input.Morning_Notes.Sector_Name))
	{
		alert "Please select sector name";
		cancel submit;
	}
	if(isNull(input.Morning_Notes.Tag))
	{
		alert "Please enter value in Tag";
		cancel submit;
	}
}
