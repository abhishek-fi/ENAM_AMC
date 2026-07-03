// Company Contact Module - Created or Edited - Load of the form - Update Analyst Field
login_user = zoho.loginuserid;
analyst = User_Master[Email_Id == login_user];
analyst_profile = analyst.Profile;
input.Analyst = analyst.ID;
if(analyst_profile != "Analyst Admin")
{
	disable Analyst;
}
