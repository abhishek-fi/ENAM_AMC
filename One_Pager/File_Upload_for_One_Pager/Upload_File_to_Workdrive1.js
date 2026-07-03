// File Upload for One Pager - Created - Successful form submission - Upload File to Workdrive
priceFile = input.Price_Chart;
valuationFile = input.Valuation_Chart;
fileUploadResponse = zoho.workdrive.uploadFile(priceFile,"k5zpva7ac367e3d554ea99e4a61f3816ffd01","Price Table 2.xlsx",true,"zoho_workdrive_connection");
pricePermalink = fileUploadResponse.get("data").get(0).get("attributes").get("Permalink");
fileUploadResponse = zoho.workdrive.uploadFile(valuationFile,"k5zpva7ac367e3d554ea99e4a61f3816ffd01","Valuation Chart 2.xlsx",true,"zoho_workdrive_connection");
valuationPermalink = fileUploadResponse.get("data").get(0).get("attributes").get("Permalink");
if(pricePermalink != "" && valuationPermalink != "")
{
	info "Files uploaded successfully";
	input.Files_Uploaded_Successfully = true;
}
