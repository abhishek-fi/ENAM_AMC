// Company Universe - Edited - User input of Focus List In-Progress - DisableFI_AB Focus List CIO Approval Request email -- Not required
approvalLink = "https://creatorapp.zoho.in" + zoho.appuri + "#Page:Focus_List_Addition?companyId=" + input.ID;
companyName = input.Company_Name;
analystName = input.Analyst2.Full_Name;
userRec = User_Master[Profile == "Head of Reseqarch"];
recipientEmail = "abhishek@fristinetech.com";
recipientName = userRec.Full_Name;
submissionDate = input.Focus_List_Initiated_Time.toString("dd-MMM-yyyy");
emailBody = "Dear " + recipientName + ",<br><br>" + "A new focus list submission has been made and requires your approval. Please review the details below:<br><br>" + "<b>Company Name:</b> " + companyName + "<br>" + "<b>Submitted By:</b> " + analystName + "<br>" + "<b>Date of Submission:</b> " + submissionDate + "<br><br>" + "Kindly review and take the necessary action.<br><br>" + "<b>Approval Link:</b> <a href='" + approvalLink + "' target='_blank'>Click here to review</a><br><br>" + "Regards,<br>" + "Research Team";
sendmail
[
	from :"rms@enamamc.com"
	to :recipientEmail
	subject :"Approval Required – New Focus List Submission"
	message :emailBody
]
