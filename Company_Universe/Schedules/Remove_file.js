// Company Universe - Based on Remove Time - Remove_file
recs = Company_Universe[Removed_List != ""];
for each  rec in recs
{
	removeList = rec.Removed_List;
	info removeList;
	info "///";
	finalList = List();
	for each  e in rec.Pre_Assessment_Presentation1
	{
		info e;
		if(removeList.contains(e) == false)
		{
			finalList.add(e);
		}
	}
	rec.Pre_Assessment_Presentation1=finalList;
	info "//";
	info rec.Pre_Assessment_Presentation1;
}
