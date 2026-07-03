// Company Universe - Edited - Update of Part of Focus List - FI_AB Focus List Added email
// Execute only if Part_of_Focus_List == "Yes"
companyName = input.Company_Name;
analystName = input.Analyst2.First_Name + " " + input.Analyst2.Last_Name;
dateAdded = zoho.currentdate;
viewLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
emailBody = "Dear Research Team,<br><br>" + "A new company has been successfully added to the focus list. Please find the details below:<br><br>" + "<b>Company Name:</b> " + companyName + "<br>" + "<b>Added By:</b> " + analystName + "<br>" + "<b>Date Added:</b> " + dateAdded + "<br><br>" + "Kindly review the entry as required.<br><br>" + "<b>View Focus List:</b> <a href='" + viewLink + "' target='_blank'>Click here to view</a><br><br>" + "Best Regards,<br>" + "ENAM AMC Research Team";
sendmail
[
	from :"rms@enamamc.com"
	to :input.Analyst2.Email_Id
	subject :"New Company Added to Focus List – " + input.Company_Name
	message :emailBody
]
sendmail
[
	from :"rms@enamamc.com"
	to :"parth@fristinetech.com"
	subject :"Copy - " + "New Company Added to Focus List – " + input.Company_Name
	message :emailBody
]
