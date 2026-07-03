void GetExcelFileCovertToSheetAndRead(int recId)
{
	onePagersList = One_Page_Module[ID == recId];
	for each  data in onePagersList
	{
		companyData = Company_Universe[ID == data.Company_Name];
		bloomberg = companyData.CD_Bloomberg_Code;
		info bloomberg;
		paramMap = Map();
		paramMap.put('method','find');
		paramMap.put('search',bloomberg);
		paramMap.put('scope','workbook');
		paramMap.put('is_case_sensitive','false');
		paramMap.put('is_exact_match','true');
		// 	https://workdrive.zoho.in/file/k5zpv7a30f409005040fa9fbe81f424a6f4ba
		// 		https://sheet.zoho.in/sheet/open/k5zpv7a30f409005040fa9fbe81f424a6f4ba?sheetid=1&range=A1
		resourceId = "ln7pj5c000832533d414d8fd741cc8a945b1a";
		search_response = invokeurl
		[
			url :"https://sheet.zoho.in/api/v2/" + resourceId
			type :POST
			parameters:paramMap
			connection:"zoho_oauth_connection"
		];
		info search_response;
		// --- STEP 1: Process the Search (Find) Response ---
		// 'search_response' is the JSON you get from the "find" API
		// For testing, you can paste your JSON string here: search_response = {...};
		search_cells = search_response.get("cells");
		info search_cells;
		target_sheet_name = "";
		target_row_index = 0;
		target_col_index = 0;
		target_worksheet_id = "";
		is_banking = false;
		// Logic: Look for "Non Banking" first. If not found, look for "Banking".
		found_non_banking = false;
		// Pass 1: Check for "Non Banking"
		for each  cell in search_cells
		{
			info cell.get("worksheet_name");
			ws_name = cell.get("worksheet_name");
			if(ws_name == "Non Banking")
			{
				target_sheet_name = ws_name;
				target_row_index = cell.get("row_index") + 2;
				target_col_index = cell.get("column_index");
				target_worksheet_id = cell.get("worksheet_id");
				found_non_banking = true;
				break;
			}
		}
		// Pass 2: If "Non Banking" not found, check for "Banking"
		if(found_non_banking == false)
		{
			for each  cell in search_cells
			{
				ws_name = cell.get("worksheet_name");
				if(ws_name == "Banking")
				{
					// Adjust exact name if different
					target_sheet_name = ws_name;
					target_row_index = cell.get("row_index") + 2;
					target_col_index = cell.get("column_index");
					target_worksheet_id = cell.get("worksheet_id");
					is_banking = true;
					break;
				}
			}
		}
		// --- STEP 2: Fetch the Table Data ---
		// Only proceed if we found a valid sheet
		if(target_sheet_name != "")
		{
			// Calculate Range
			// Based on your image: Table starts at Found Row (6) and ends at Row 17 (11 rows later)
			// Banking has 1 extra row
			rows_to_fetch = if(is_banking,12,11);
			start_row = target_row_index;
			end_row = target_row_index + rows_to_fetch;
			start_col = target_col_index;
			end_col = target_col_index + 3;
			// Assuming 4 columns (Label + 3 Data columns)
			// Make the API Call to get the specific range content
			// Replace 'resource_id' with your actual File ID
			paramMap = Map();
			paramMap.put('method','range.content.get');
			paramMap.put('worksheet_name',target_sheet_name);
			paramMap.put('start_row',start_row);
			paramMap.put('start_column',start_col);
			paramMap.put('end_row',end_row);
			paramMap.put('end_column',end_col);
			response_map = invokeurl
			[
				url :"https://sheet.zoho.in/api/v2/" + resourceId
				type :POST
				parameters:paramMap
				connection:"zoho_oauth_connection"
			];
			// Note: If you are using invokeUrl for "worksheet.content.get", use that response here.
			// Assuming 'response_map' now contains the JSON structure from your first example.
			// --- STEP 3: Generate HTML ---
			// Parse the data from the fetch response
			// NOTE: Adjust keys below depending on if you use zoho.sheet wrapper or raw API
			// If raw API (worksheet.content.get), use: rangeDetails = response_map.get("range_details");
			rangeDetails = response_map.get("range_details");
			html_string = "<table style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px; border: 1px solid #8ec1da;'>";
			for each  rowItem in rangeDetails
			{
				currentRowIndex = rowItem.get("row_index");
				rowDetails = rowItem.get("row_details");
				// Convert row list to map for easy column access
				colMap = Map();
				for each  cell in rowDetails
				{
					colMap.put(cell.get("column_index"),cell.get("content"));
				}
				// --- DYNAMIC ROW LOGIC (Relative to target_row_index) ---
				// 1. Title Row (The Company Name - e.g., Row 6)
				if(currentRowIndex == target_row_index)
				{
					val = ifnull(colMap.get(target_col_index),"");
					html_string = html_string + "<tr style='background-color: #d9d9d9; font-weight: bold; border-bottom: 1px solid #8ec1da;'>";
					html_string = html_string + "<td colspan='4' style='padding: 8px; text-align: left;'>" + val + "</td>";
					html_string = html_string + "</tr>";
				}
				// 2. Sub-Header (Curr Price / M Cap - e.g., Row 7)
				else if(currentRowIndex == target_row_index + 1)
				{
					label = ifnull(colMap.get(target_col_index),"");
					val1 = ifnull(colMap.get(target_col_index + 2),"");
					// Skip one col
					val2 = ifnull(colMap.get(target_col_index + 3),"");
					html_string = html_string + "<tr style='background-color: #ffffff; font-weight: bold; border-bottom: 1px solid #000000;'>";
					html_string = html_string + "<td style='padding: 8px; border-right: 1px dotted #8ec1da;'>" + label + "</td>";
					html_string = html_string + "<td style='padding: 8px; border-right: 1px dotted #8ec1da;'></td>";
					// Spacer
					html_string = html_string + "<td style='padding: 8px; text-align: right; border-right: 1px dotted #8ec1da;'>" + val1 + "</td>";
					html_string = html_string + "<td style='padding: 8px; text-align: right;'>" + val2 + "</td>";
					html_string = html_string + "</tr>";
				}
				// 3. Main Header (Financial Summary - e.g., Row 8)
				else if(currentRowIndex == target_row_index + 2)
				{
					html_string = html_string + "<tr style='background-color: #002060; color: white;'>";
					html_string = html_string + "<td style='padding: 8px; border-right: 1px dotted #8ec1da;'>" + ifnull(colMap.get(target_col_index),"") + "</td>";
					html_string = html_string + "<td style='padding: 8px; text-align: center; border-right: 1px dotted #8ec1da;'>" + ifnull(colMap.get(target_col_index + 1),"") + "</td>";
					html_string = html_string + "<td style='padding: 8px; text-align: center; border-right: 1px dotted #8ec1da;'>" + ifnull(colMap.get(target_col_index + 2),"") + "</td>";
					html_string = html_string + "<td style='padding: 8px; text-align: center;'>" + ifnull(colMap.get(target_col_index + 3),"") + "</td>";
					html_string = html_string + "</tr>";
				}
				// 4. Data Rows (Everything else)
				else
				{
					html_string = html_string + "<tr style='background-color: #ffffff; border-bottom: 1px solid #8ec1da;'>";
					// Label Column
					html_string = html_string + "<td style='padding: 6px; border-right: 1px dotted #8ec1da;'>" + ifnull(colMap.get(target_col_index),"") + "</td>";
					// Data Columns Loop
					// Columns are: start+1, start+2, start+3
					dataCols = {target_col_index + 1,target_col_index + 2,target_col_index + 3};
					for each  idx in dataCols
					{
						cellContent = ifnull(colMap.get(idx),"");
						// Red Color Logic for Brackets
						textColor = "black";
						if(cellContent.contains("(") && cellContent.contains(")"))
						{
							textColor = "red";
						}
						html_string = html_string + "<td style='padding: 6px; text-align: right; border-right: 1px dotted #8ec1da; color: " + textColor + ";'>" + cellContent + "</td>";
					}
					html_string = html_string + "</tr>";
				}
			}
			html_string = html_string + "</table>";
			// --- STEP 4: Update the Record ---
			// Assuming input.ID is your record ID
			optionalMap = Map();
			updateMap = Map();
			updateMap.put("Block_7_Content",html_string);
			// 		update_resp = zoho.creator.updateRecord("industechco","research-application","One_Pager_Report",4868731000000026007,updateMap,optionalMap,"zoho_oauth_connection");
			data.Block_7_Content=html_string;
			// Debug
			info "Selected Sheet: " + target_sheet_name;
			info "Is Banking: " + is_banking;
			info html_string;
		}
		else
		{
			info "No matching sheet (Banking or Non Banking) found.";
		}
	}
}
