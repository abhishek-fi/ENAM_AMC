// Company Universe - In My Companies - On click of action item: Create One Pager - One Pager Widget Link
onePagerData = One_Page_Module[Company_Name == input.ID && Added_Time >= zoho.currenttime.toStartOfMonth() && Added_Time <= zoho.currenttime.eomonth(0)];
if(onePagerData.ID != null)
{
	// 	info "One Pager for " + input.Company_Name + " already exists. Kindly update the record from My One Pager Report";
	openUrl("#Form:Stateless_Banner","popup window","height=190,width=390px");
}
else
{
	companyName = input.Company_Name;
	ticker = input.CD_Bloomberg_Code;
	companyID = input.ID;
	baseUrl = "#Page:One_Pager";
	url = baseUrl + "?create_new=true&company_id=" + companyID + "&company_name=" + encodeUrl(companyName) + "&ticker=" + encodeUrl(ticker);
	openUrl(url,"new window","successive=true");
}
