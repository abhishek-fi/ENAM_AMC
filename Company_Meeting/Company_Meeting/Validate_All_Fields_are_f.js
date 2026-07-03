// Company Meeting - Created or Edited - Validations on form submission - Validate All Fields are filled
if(Manual_Edit_Flag == true)
{
	// 1. Initialize a variable to track if any error was found
	validationFailed = false;
	// 2. Check all fields. If an error is found, alert AND set the flag to true.
	// Do NOT use 'cancel submit' inside these blocks.
	if(Meeting_Time_from == null)
	{
		alert(Meeting_Time_from,"From time is not added.");
		validationFailed = true;
	}
	if(Meeting_Time_to == null)
	{
		alert(Meeting_Time_to,"To time is not added.");
		validationFailed = true;
	}
	if(Type_of_meeting == null || Type_of_meeting == "")
	{
		alert(Type_of_meeting,"Type of meeting is not added.");
		validationFailed = true;
	}
	if(Company_Name == null)
	{
		alert(Company_Name,"Company is not added.");
		validationFailed = true;
	}
	if(Meeting_Location == null)
	{
		alert(Meeting_Location,"Meeting location is not added.");
		validationFailed = true;
	}
	if(Status == null || Status == "")
	{
		alert(Status,"Status is not added.");
		validationFailed = true;
	}
	if(Title_of_Company_Attendees == null || Title_of_Company_Attendees == "")
	{
		alert(Title_of_Company_Attendees,"Title of Company attendees is not added.");
		validationFailed = true;
	}
	if(Part_of_Investment_Universe == null || Part_of_Investment_Universe == "")
	{
		alert(Part_of_Investment_Universe,"Part of Investment Universe is not added.");
		validationFailed = true;
	}
	if(Part_of_any_of_the_portfolio_on_the_date_of_meeting == null || Part_of_any_of_the_portfolio_on_the_date_of_meeting == "")
	{
		alert(Part_of_any_of_the_portfolio_on_the_date_of_meeting,"Part of the portfolio on the date of meeting is not added.");
		validationFailed = true;
	}
	if(Meeting_Was_Attended == null || Meeting_Was_Attended == "")
	{
		alert(Meeting_Was_Attended,"Meeting was attended is not added");
		validationFailed = true;
	}
	if(Name_of_Fund_Manager_attended_the_meeting == null)
	{
		alert(Name_of_Fund_Manager_attended_the_meeting,"Fund Managers are not added.");
		validationFailed = true;
	}
	if(Has_CIO_attended_the_meeting == null || Has_CIO_attended_the_meeting == "")
	{
		alert(Has_CIO_attended_the_meeting,"CIO attended the meeting is not added.");
		validationFailed = true;
	}
	if(Meeting_Organized_by_Broker == null || Meeting_Organized_by_Broker == "")
	{
		alert(Meeting_Organized_by_Broker,"Meeting organized by broker is not added.");
		validationFailed = true;
	}
	if(Meeting_Note == null || Meeting_Note == "")
	{
		alert(Meeting_Note,"Meeting note is not added.");
		validationFailed = true;
	}
	// Conditional Logic Checks
	if(Status == "Cancelled" && Cancellation_Reason == null)
	{
		alert(Cancellation_Reason,"Cancellation Reason is not added.");
		validationFailed = true;
	}
	if(Meeting_Organized_by_Broker == "Yes" && Broker_name == null)
	{
		alert(Broker_name,"Broker Name cannot be empty.");
		validationFailed = true;
	}
	if(Closing_Price != 0 && Target_price == 0 || Target_price == null)
	{
		alert(Target_price,"Target Price cannot be 0 or empty.");
		validationFailed = true;
	}
	// 3. Final Check
	// If ANY of the above checks failed, the variable is now true.
	if(validationFailed == true)
	{
		cancel submit;
	}
}
