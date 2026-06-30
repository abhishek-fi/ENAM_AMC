// Created or Edited - Validations on form submission - Mandate fields
if(input.Have_you_attended_today_s_meeting == "Yes")
{
	if(isNull(input.Mode))
	{
		alert "Please select meeting mode";
		cancel submit;
	}
}
else if(input.Have_you_attended_today_s_meeting == "No")
{
	if(isNull(input.Not_attended_reason))
	{
		alert "Please provide not attendded meeting reson";
		cancel submit;
	}
}
