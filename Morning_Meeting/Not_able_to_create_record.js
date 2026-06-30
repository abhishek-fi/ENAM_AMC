// Created - Load of the form - Not able to create record directedly from the form
if(zoho.loginuserid != "zoho@enamamc.com")
{
	disable Mode;
	disable Not_attended_reason;
	disable Location;
	disable Will_you_be_able_to_join_tomorrow;
	disable Analyst_Name;
	disable Meeting_Detail;
	disable Mode;
	alert "You do not have access to create record!";
}
