map validation_rule.UPI_Regex_Validation(String crmAPIRequest)
{
// Convert request to map and extract record fields
entityMap = crmAPIRequest.toMap().get("record");
// Get UPI field value (replace 'UPI' with your actual field API name)
upiId = entityMap.get("UPI");
response = Map();
// Regex for UPI ID validation: allows alphanumeric, dot, underscore before '@',
// and ensures a valid bank handle after '@'
regexPattern = "[a-zA-Z0-9._]{2,}@[a-zA-Z]{3,}";
// Allow empty field
if(upiId == null || upiId.trim() == "")
{
	response.put("status","success");
}
// Perform validation
else if(!upiId.matches(regexPattern))
{
	response.put("status","error");
	response.put("message","Invalid UPI ID format. Please enter a valid UPI (e.g., name@bank).");
}
else
{
	response.put("status","success");
}
return response;
}
