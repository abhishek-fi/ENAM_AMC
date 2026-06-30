// Created or Edited - Validations on form submission - Mandate fields
if(input.Will_you_be_able_to_join_tomorrow == "Yes")
{
	if(isNull(input.Mode))
	{
		alert "Please enter meeting mode!";
		cancel submit;
	}
}
else if(input.Will_you_be_able_to_join_tomorrow == "No")
{
	if(isNull(input.Not_attended_reason))
	{
		alert "Please enter meetiong not attended reson!";
		cancel submit;
	}
}
