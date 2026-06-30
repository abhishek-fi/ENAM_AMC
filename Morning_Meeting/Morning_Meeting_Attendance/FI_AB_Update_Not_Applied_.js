// Created or Edited - Successful form submission - FI_AB Update Not Applied List in Master
if(input.Will_you_be_able_to_join_tomorrow == "" || input.Will_you_be_able_to_join_tomorrow == "Not Responded" && input.Meeting_Detail != null)
{
	thisapp.FI_AB_Update_Not_Applied_List(input.Meeting_Detail);
}
