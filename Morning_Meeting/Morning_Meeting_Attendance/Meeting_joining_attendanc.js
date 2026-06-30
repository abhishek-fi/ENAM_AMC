// Created or Edited - Validations on form submission - Meeting joining attendance status blank
if(isNull(input.Will_you_be_able_to_join_tomorrow))
{
	alert "Please Upadte your meeting satus Will_you_be_able_to_join_tomorrow?.";
	cancel submit;
}
