void FI_AB_One_Pager_Static_HTML(int recId)
{
	onePagerList = One_Page_Module[ID == recId];
	////
	for each  one in onePagerList
	{
		id = one.ID;
		data = one;
		block8data = data.Print_Layout_HTML;
		info block8data;
		// -----------------------------------------------------------------------------
		// Build the image URL
		// NOTE: The hardcoded token after /image-download/ looks like a report-perma
		// token, not an image-download privacy token. If the image returns 401/403
		// after this script runs, that token is the next thing to fix.
		// -----------------------------------------------------------------------------
		new_img_name = data.Valuation_Chart_Image.getSuffix("image/").getPrefix(" lowqual");
		new_img_url = "https://creatorapp.zohopublic.in" + zoho.appuri + "view/One_Page_Module_Report/" + id + "/Valuation_Chart_Image/image-download/" + "ZvARRwjzAYrdQsMBNKCebpbAaExxayV8gemjBz8a4Hr6vAGjYFgfTvuBeW0RyZMSBUkEG4Z62GKHz2yUhg0WdzvPa7BGVwFeZYQ0" + "?filepath=" + new_img_name;
		// =============================================================================
		// VALUATION CHART — swap the <img> inside its <div class="img-container">
		// =============================================================================
		// Rendered shape from src/App.js renderBox():
		//   <div class="print-header">Valuation Chart</div>
		//   <div class="print-body white">
		//     <div class="img-container"><img src="..."></div>
		//   </div>
		//   </div>   <-- closes the outer print-box
		// =============================================================================
		vc_start = "<div class=\"print-header\">Valuation Chart</div><div class=\"print-body white\"><div class=\"img-container\">";
		vc_end = "</div></div></div>";
		if(block8data.contains(vc_start))
		{
			before_vc = block8data.getPrefix(vc_start);
			after_vc = block8data.getSuffix(vc_start).getSuffix(vc_end);
			new_img_tag = "<img src=\"" + new_img_url + "\">";
			html_new = before_vc + vc_start + new_img_tag + vc_end + after_vc;
			status = "Available";
		}
		else
		{
			info "Valuation Chart anchor not found — leaving Print_Layout_HTML unchanged.";
			status = "Not Available";
			html_new = block8data;
		}
		one.Print_Layout_HTML=html_new;
		// 		sendmail
		// 		[
		// 			from :"rms@enamamc.com"
		// 			to :"abhishek@fristinetech.com"
		// 			subject :"Valuation Chart HTML - " + status
		// 			message :new_img_url
		// 		]
		// 		info html_new;
		// 		info "---------------------";
		// =============================================================================
		// PRICE CHART — swap the table body inside <div class="table-fit">
		// =============================================================================
		// Rendered shape:
		//   <div class="print-header">Price Chart</div>
		//   <div class="print-body white">
		//     <div class="table-fit">...table HTML...</div>
		//   </div>
		//   </div>   <-- closes the outer print-box
		// =============================================================================
		if(one.Block_7_Content.isEmpty() == false)
		{
			pc_start = "<div class=\"print-header\">Price Chart</div><div class=\"print-body white\"><div class=\"table-fit\">";
			pc_end = "</div></div></div>";
			if(html_new.contains(pc_start))
			{
				before_pc = html_new.getPrefix(pc_start);
				after_pc = html_new.getSuffix(pc_start).getSuffix(pc_end);
				html_new = before_pc + pc_start + one.Block_7_Content + pc_end + after_pc;
				one.Print_Layout_HTML=html_new;
				// 				info html_new;
				// 				sendmail
				// 				[
				// 					from :"rms@enamamc.com"
				// 					to :"abhishek@fristinetech.com"
				// 					subject :"after Price Chart HTML"
				// 					message :html_new
				// 				]
			}
			else
			{
				info "Price Chart anchor not found — leaving Price Chart unchanged.";
			}
		}
	}
	thisapp.Generate_One_Pager_PDF_to_Workdrive(one.ID);
}
