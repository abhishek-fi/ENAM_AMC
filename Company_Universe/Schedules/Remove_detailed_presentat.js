// Company Universe - Based on Remove Time Detail - Remove detailed presentation file
recs = Company_Universe[Removed_list_detail != ""];
for each  rec in recs
{
	removeList = rec.Removed_list_detail;
	info removeList;
	info "///";
	finalList = List();
	for each  e in rec.Detailed_Presentation_File
	{
		info e;
		if(removeList.contains(e) == false)
		{
			finalList.add(e);
		}
	}
	rec.Detailed_Presentation_File=finalList;
	info "//";
	info rec.Detailed_Presentation_File;
}
