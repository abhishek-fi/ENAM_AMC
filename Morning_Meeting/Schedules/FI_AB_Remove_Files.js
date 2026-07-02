// Morning Notes - Based on Remove Time - FI_AB Remove Files
recs = Morning_Notes[Record_Status1 == "Draft" && Removed_List != ""];
for each  rec in recs
{
	removeList = rec.Removed_List;
	info removeList;
	info "///";
	finalList = List();
	for each  e in rec.Additional_Attachment
	{
		info e;
		if(removeList.contains(e) == false)
		{
			finalList.add(e);
		}
	}
	rec.Additional_Attachment=finalList;
	info "//";
	info rec.Additional_Attachment;
}
