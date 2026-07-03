// Deletion From Focus List - Load of the form - Populate data form company universe
hide Record_ID;
disable Date_field;
disable Company_Name;
disable Sector;
disable Request_Type;
disable Analyst_Name;
data = Company_Universe[ID == input.Record_ID];
input.Company_Name = data.Company_Name;
input.Sector = data.Sector;
input.Analyst_Name = data.Analyst2;
