// Company Meeting - Created or Edited - Validations on form submission - Validate Cancellation Reason is Provided
if(input.Status == "Cancelled" && input.Cancellation_Reason == null || input.Cancellation_Reason == "")
{
	alert "Kindly provide the cancellation reason.";
	cancel submit;
}
