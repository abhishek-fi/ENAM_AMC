// One Page Module - In All One Pagers - On click of action item: Download - download one pager
header = Map();
header.put("Accept","application/vnd.api+json");
header.put("Content-Type","application/json");
att_param1 = Map();
att_param1.put("resource_id",input.File_Resource_Id);
linkName = zoho.encryption.urlEncode(input.Company_Name.Company_Name + " - " + zoho.currentdate.toString("MM-yyyy"));
att_param1.put("link_name",linkName);
att_param1.put("link_type","download");
att_param1.put("request_user_data","false");
att_param1.put("allow_download","true");
data_param1 = Map();
data_param1.put("type","links");
data_param1.put("attributes",att_param1);
data = Map();
data.put("data",data_param1);
response = invokeurl
[
	url :"https://www.zohoapis.in/workdrive/api/v1/links"
	type :POST
	parameters:data.toString()
	headers:header
	connection:"zoho_workdrive_connection"
];
attributes = response.get("data").get("attributes");
download_url = attributes.get("download_url") + "?directDownload=true";
openUrl(download_url,"new window");
