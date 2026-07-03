// On 01-Jun-2026 - At 00:00:00 Monthly - FI_AB One pager flag
oneComps = Company_Universe[Current_Month_One_Pager == true];
for each  rec in oneComps
{
	rec.Current_Month_One_Pager=false;
}
