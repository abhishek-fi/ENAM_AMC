// Company Universe - Edited - Load of the form - FI_AB Disable fields based on loggedin user
// currently no use of this code, since all the editing happening in widget
if(zoho.loginuserid == input.FM_1_Name.Email_Id)
{
	disable FM_2_L1_Comment;
	disable FM_3_L1_Comment;
	disable FM_2_L2_Comment;
	disable FM_3_L2_Comment;
	disable FM_2_L3_Comment;
	disable FM_3_L3_Comment;
	disable HoR_L1_Comment;
	disable HoR_L2_Comment;
	disable HoR_L3_Comment;
}
else if(zoho.loginuserid == input.FM_2_Name.Email_Id)
{
	disable FM_1_L1_Comment;
	disable FM_3_L1_Comment;
	disable FM_1_L2_Comment;
	disable FM_3_L2_Comment;
	disable FM_1_L3_Comment;
	disable FM_3_L3_Comment;
	disable HoR_L1_Comment;
	disable HoR_L2_Comment;
	disable HoR_L3_Comment;
}
else if(zoho.loginuserid == input.FM_3_Name.Email_Id)
{
	disable FM_1_L1_Comment;
	disable FM_2_L1_Comment;
	disable FM_1_L2_Comment;
	disable FM_2_L2_Comment;
	disable FM_1_L3_Comment;
	disable FM_2_L3_Comment;
	disable HoR_L1_Comment;
	disable HoR_L2_Comment;
	disable HoR_L3_Comment;
}
else if(zoho.loginuserid == "zoho@enamamc.com")
{
	disable FM_2_L1_Comment;
	disable FM_3_L1_Comment;
	disable FM_2_L2_Comment;
	disable FM_3_L2_Comment;
	disable FM_2_L3_Comment;
	disable FM_3_L3_Comment;
	disable FM_1_L1_Comment;
	disable FM_1_L2_Comment;
	disable FM_1_L3_Comment;
}
else
{
	disable FM_2_L1_Comment;
	disable FM_3_L1_Comment;
	disable FM_2_L2_Comment;
	disable FM_3_L2_Comment;
	disable FM_2_L3_Comment;
	disable FM_3_L3_Comment;
	disable FM_1_L1_Comment;
	disable FM_1_L2_Comment;
	disable FM_1_L3_Comment;
	disable HoR_L1_Comment;
	disable HoR_L2_Comment;
	disable HoR_L3_Comment;
}
