// Created or Edited - Load of the form - FI_AB Filter Companies for User Profiles
userRec = User_Master[Email_Id == zoho.loginuserid];
currValue = input.Company_Name;
if(userRec.Profile == "Analyst Admin")
{
	compList = Company_Universe[Analyst2 != null].ID.getAll();
	input.Company_Name:ui.add(compList);
	input.Company_Name = currValue;
}
else if(userRec.Profile == "Analyst")
{
	compList = Company_Universe[Analyst2 == userRec.ID].ID.getAll();
	input.Company_Name:ui.add(compList);
	input.Company_Name = currValue;
}
input.Company_Name = currValue;
