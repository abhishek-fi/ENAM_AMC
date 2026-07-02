// On 11-Dec-2025 - At 11:30:00 Daily - FI_AB Generate Record Template Content
thisday = zoho.currentdate;
day = thisday.getDayOfWeek();
if(day == 1 || day == 7)
{
	info "Today is weekend. Skipping.";
	return;
}
meeting = Meeting_Details[Meeting_Date == zoho.currentdate];
todayMeeting = meeting.ID;
try 
{
	thisapp.FI_AB_Update_Not_Applied_List(todayMeeting);
}catch (err)
{
	info err;
}
try 
{
	thisapp.FI_AB_Create_Absentees_Record(todayMeeting);
}catch (err)
{
	info err;
}
try 
{
	thisapp.FI_AB_Update_Not_Attended_List(todayMeeting);
}catch (err)
{
	info err;
}
fileName = meeting.Meeting_Title.replaceAll(" ","_");
todayNotes = Morning_Meeting_Notes_Master[Meeting_Detail == todayMeeting];
recId = todayNotes.ID;
updates_html = "";
// =======================================
// GET NOTES
// =======================================
notes_list = Morning_Notes[Submission_Date_Time < zoho.currenttime && Submission_Date_Time > zoho.currenttime.subBusinessDay(1) && Record_Status1 == "Stored"];
// =======================================
// GROUP BY ANALYST
// =======================================
group_map = Map();
order_list = List();
for each  note_id in notes_list
{
	note_rec = Morning_Notes[ID == note_id];
	analyst_long = note_rec.Analyst.toLong();
	existing_list = group_map.get(analyst_long);
	if(existing_list == null)
	{
		new_list = List();
		new_list.add(note_id);
		group_map.put(analyst_long,new_list);
		order_list.add(analyst_long);
	}
	else
	{
		existing_list.add(note_id);
		group_map.put(analyst_long,existing_list);
	}
}
// =======================================
// START SINGLE TABLE
// =======================================
table_html = "<table width='100%' style='border-collapse:collapse;border-top:1.5px solid #0066CC;border-bottom:1.5px solid #0066CC;table-layout:fixed;'>";
// =======================================
// RENDER ANALYST ROWS
// =======================================
for each  analyst_long in order_list
{
	notes_for_user = group_map.get(analyst_long);
	analyst_rec = User_Master[ID == analyst_long];
	analyst_name = analyst_rec.First_Name + " " + analyst_rec.Last_Name;
	// =======================================
	// ONE <tr> PER NOTE (NOT ONE GIANT <tr> PER ANALYST)
	// The PDF renderer treats a <tr> as one atomic, non-splittable
	// block. When an analyst's whole notes blob sits in a single row
	// and doesn't fully fit in the space left on the page, the ENTIRE
	// row is pushed to the next page - leaving the gap the client sees.
	// Splitting into a row per note keeps each atomic block small so
	// pages fill up before breaking. The analyst's notes still read as
	// one seamless block: name + blue separator only on the first row,
	// and matched padding keeps the same spacing between their notes.
	// =======================================
	total_notes = notes_for_user.size();
	note_index = 0;
	for each  n_id in notes_for_user
	{
		note_rec = Morning_Notes[ID == n_id];
		// =======================================
		// BUILD TOPIC
		// =======================================
		if(note_rec.Company_Name != null)
		{
			compName = Company_Universe[ID == note_rec.Company_Name].Company_Name;
			topic = compName + " - " + note_rec.Topic_Header.toString();
		}
		else if(note_rec.Sector_Name != null)
		{
			sectName = Sector_Master[ID == note_rec.Sector_Name].Sector_Name;
			topic = sectName + " - " + note_rec.Topic_Header.toString();
		}
		else
		{
			topic = note_rec.Topic_Header.toString();
		}
		// =======================================
		// GET NOTES HTML
		// =======================================
		notes_html = note_rec.Meet_Note.toString();
		// =======================================
		// SAFE SANITIZER (STYLE-PRESERVING)
		// For each tag we inject our defaults WITHOUT clobbering styling
		// the author added when pasting content into the note:
		//   pass 1 - tag already has style="..."  -> MERGE our defaults
		//            in FRONT of the existing declarations. Because later
		//            declarations win in CSS, the author's own values
		//            (colours, widths, backgrounds) override ours.
		//   pass 2 - tag has NO style             -> ADD one. The
		//            "(?=[ >])(?![^>]*style=)" guard means: only a real
		//            tag (followed by space or '>') that has no style yet
		//            - so we never double-add or corrupt <thead>/<tbody>.
		// Tables/images also get page-break-inside:avoid so they aren't
		// sliced across a page. We no longer FORCE width:100%, so a table
		// keeps its own width (only capped by max-width:100%).
		// =======================================
		notes_html = notes_html.replaceAll("<table style=\"","<table style=\"max-width:100%;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid;");
		notes_html = notes_html.replaceAll("<table(?=[ >])(?![^>]*style=)","<table style=\"max-width:100%;border-collapse:collapse;page-break-inside:avoid;break-inside:avoid;\" ");
		notes_html = notes_html.replaceAll("<td style=\"","<td style=\"word-wrap:break-word;overflow-wrap:break-word;vertical-align:top;");
		notes_html = notes_html.replaceAll("<td(?=[ >])(?![^>]*style=)","<td style=\"word-wrap:break-word;overflow-wrap:break-word;vertical-align:top;\" ");
		notes_html = notes_html.replaceAll("<th style=\"","<th style=\"word-wrap:break-word;overflow-wrap:break-word;vertical-align:top;");
		notes_html = notes_html.replaceAll("<th(?=[ >])(?![^>]*style=)","<th style=\"word-wrap:break-word;overflow-wrap:break-word;vertical-align:top;\" ");
		// FIX PARAGRAPH SPACING
		notes_html = notes_html.replaceAll("<p style=\"","<p style=\"margin:0 0 8px 0;");
		notes_html = notes_html.replaceAll("<p(?=[ >])(?![^>]*style=)","<p style=\"margin:0 0 8px 0;\" ");
		notes_html = notes_html.replaceAll("<div style=\"","<div style=\"word-break:normal;");
		notes_html = notes_html.replaceAll("<div(?=[ >])(?![^>]*style=)","<div style=\"word-break:normal;\" ");
		notes_html = notes_html.replaceAll("<span style=\"","<span style=\"word-break:normal;");
		notes_html = notes_html.replaceAll("<span(?=[ >])(?![^>]*style=)","<span style=\"word-break:normal;\" ");
		notes_html = notes_html.replaceAll("<img style=\"","<img style=\"max-width:100%;height:auto;page-break-inside:avoid;break-inside:avoid;");
		notes_html = notes_html.replaceAll("<img(?=[ >])(?![^>]*style=)","<img style=\"max-width:100%;height:auto;page-break-inside:avoid;break-inside:avoid;\" ");
		notes_html = notes_html.replaceAll("&nbsp"," ");
		notes_html = notes_html.replaceAll("class=\"[^\"]*\"","");
		notes_html = notes_html.replaceAll("id=\"[^\"]*\"","");
		// =======================================
		// STRUCTURED NOTE BLOCK
		// =======================================
		note_block = "<div style='margin-bottom:6px;'><b>" + topic + "</b></div>" + "<div>" + notes_html + "</div>";
		// =======================================
		// SEAMLESS GROUPING WITHIN AN ANALYST
		//  - name + blue border-top only on the first note's row, so no
		//    line appears between an analyst's own notes
		//  - top pad 12px on the first row / 8px otherwise, bottom pad
		//    12px on the last row / 8px otherwise => 8+8=16px between
		//    an analyst's notes, matching the previous spacing exactly
		// =======================================
		is_first = note_index == 0;
		is_last = note_index == total_notes - 1;
		if(is_first)
		{
			name_cell = analyst_name;
			row_border = "border-top:1.5px solid #0066CC;";
			pad_top = "12px";
		}
		else
		{
			name_cell = "";
			row_border = "";
			pad_top = "8px";
		}
		if(is_last)
		{
			pad_bottom = "12px";
		}
		else
		{
			pad_bottom = "8px";
		}
		name_td_style = "width:140px;padding:" + pad_top + " 12px " + pad_bottom + " 12px;border-right:1.5px solid #0066CC;vertical-align:top;font-weight:bold;";
		notes_td_style = "padding:" + pad_top + " 12px " + pad_bottom + " 12px;vertical-align:top;word-wrap:break-word;overflow-wrap:break-word;";
		row_html = "<tr style='" + row_border + "'>" + "<td style='" + name_td_style + "'>" + name_cell + "</td>" + "<td style='" + notes_td_style + "'>" + note_block + "</td>" + "</tr>";
		table_html = table_html + row_html;
		note_index = note_index + 1;
	}
}
// =======================================
// CLOSE TABLE
// =======================================
table_html = table_html + "</table>";
// =======================================
// EMPTY STATE
// =======================================
if(notes_list.count(ID) == 0)
{
	table_html = "No significant development to update.";
}
// =======================================
// APPLY FONT (PT SERIF)
// =======================================
updates_html = "<div style='font-family:\"PT Serif\", Georgia, serif; font-size:14px; line-height:1.6;'>" + table_html + "</div>";
// =======================================
// SAVE
// =======================================
todayNotes.Updates_RT=updates_html;
todayNotes.Updates_RT='<div class="zc-FF-change">' + todayNotes.Updates_RT + '</div><style>.zc-FF-change * {font-family: "Liberation Serif" !important; } </style> ';
// =======================================
// DATE PROCESS
// =======================================
meetingDate = meeting.Meeting_Date.getDate();
startTime = "09:30 AM";
endTime = "10:00 AM";
cleanDate = meetingDate.replaceAll("(st|nd|rd|th)","");
parsedDate = cleanDate.toDate("dd MMMM yyyy");
formattedDate = parsedDate.toString("MMMM dd, yyyy");
finalDateTime = formattedDate + " - " + startTime + " to " + endTime;
todayNotes.Meeting_Date_RT=finalDateTime;
todayNotes.Meeting_Location_RT="Mumbai (Large Conferance Room)";
// =======================================
// ATTENDEES
// =======================================
attendee_ids = Morning_Meeting_Notes[Meeting_Detail == todayMeeting && Have_you_attended_today_s_meeting == "Yes" && Analyst != null].Analyst.getAll();
attendee_ids = attendee_ids.distinct();
attendee_names = List();
jiten_list = List();
fund_manager_list = List();
analyst_admin_list = List();
analyst_list = List();
others_list = List();
for each  uid in attendee_ids
{
	user_rec = User_Master[ID == uid];
	if(user_rec.count() > 0)
	{
		if(user_rec.First_Name.toLowerCase() == "jiten")
		{
			jiten_list.add(uid);
		}
		else if(user_rec.Profile == "Fund Manager")
		{
			fund_manager_list.add(uid);
		}
		else if(user_rec.Profile == "Analyst Admin")
		{
			analyst_admin_list.add(uid);
		}
		else if(user_rec.Profile == "Analyst")
		{
			analyst_list.add(uid);
		}
		else
		{
			others_list.add(uid);
		}
	}
}
final_order = List();
final_order.addAll(jiten_list);
final_order.addAll(fund_manager_list);
final_order.addAll(analyst_admin_list);
final_order.addAll(analyst_list);
final_order.addAll(others_list);
for each  uid in final_order
{
	user_rec = User_Master[ID == uid];
	if(user_rec.count() > 0)
	{
		checkNotes = Morning_Notes[Analyst == uid && Meeting_Detail == todayMeeting];
		if(checkNotes.count() > 0)
		{
			attendee_names.add(user_rec.First_Name + " " + user_rec.Last_Name);
		}
		else
		{
			if(user_rec.Profile == "Analyst")
			{
				attendee_names.add(user_rec.First_Name + " " + user_rec.Last_Name + "*");
			}
			else
			{
				attendee_names.add(user_rec.First_Name + " " + user_rec.Last_Name);
			}
		}
	}
}
// Split columns
left_col = List();
right_col = List();
i = 0;
for each  name in attendee_names
{
	if(i < 8)
	{
		left_col.add(name);
	}
	else
	{
		right_col.add(name);
	}
	i = i + 1;
}
// Build HTML
left_html = "";
for each  name in left_col
{
	left_html = left_html + name + "<br>";
}
right_html = "";
for each  name in right_col
{
	right_html = right_html + name + "<br>";
}
divider_style = "";
right_padding = "";
if(right_col.size() > 0)
{
	divider_style = "border-right:1px solid #444;";
	right_padding = "padding-left:12px;";
}
attendees_html = "<table width='100%' cellpadding='4' cellspacing='0' style='border-collapse:collapse;'>" + "<tr>" + "<td width='50%' style='vertical-align:top;" + divider_style + "'>" + left_html + "</td>" + "<td width='50%' style='vertical-align:top;" + right_padding + "'>" + right_html + "</td>" + "</tr></table>";
todayNotes.Attendees_RT=attendees_html;
// =======================================
// PARTICIPANTS
// =======================================
all_users = User_Master[ID != null && User_Status == "Active"];
jiten_list = List();
raghuvendra_list = List();
kuldeep_list = List();
alpha_list = List();
for each  user_rec in all_users
{
	fname = ifnull(user_rec.First_Name,"").trim();
	lname = ifnull(user_rec.Last_Name,"").trim();
	profile = ifnull(user_rec.Profile,"");
	full_name = fname + " " + lname;
	// Static names in fixed order
	if(fname.toLowerCase() == "jiten" && lname.toLowerCase() == "doshi")
	{
		jiten_list.add(full_name);
	}
	else if(fname.toLowerCase() == "raghavendra" && lname.toLowerCase() == "reddy")
	{
		raghuvendra_list.add(full_name);
	}
	else if(fname.toLowerCase() == "kuldeep" && lname.toLowerCase() == "gangwar")
	{
		kuldeep_list.add(full_name);
	}
	// Fund Manager - always add
	else if(profile == "Fund Manager")
	{
		alpha_list.add(full_name);
	}
	// Analyst / Analyst Admin - check attendance
	else if(profile == "Analyst Admin" || profile == "Analyst")
	{
		checkAttendance = Morning_Meeting_Notes[Analyst == user_rec.ID && Meeting_Detail == todayMeeting && Have_you_attended_today_s_meeting == "Yes"];
		if(checkAttendance.count() > 0)
		{
			alpha_list.add(full_name);
		}
		else
		{
			alpha_list.add(full_name + "*");
		}
	}
	// Others
	else
	{
		alpha_list.add(full_name);
	}
}
// Sort all non-static users alphabetically
alpha_list = alpha_list.sort();
// Final order
participant_names = List();
participant_names.addAll(jiten_list);
participant_names.addAll(raghuvendra_list);
participant_names.addAll(kuldeep_list);
participant_names.addAll(alpha_list);
// Split columns
left_col = List();
right_col = List();
i = 0;
split_at = participant_names.size() / 2;
for each  name in participant_names
{
	if(i < split_at)
	{
		left_col.add(name);
	}
	else
	{
		right_col.add(name);
	}
	i = i + 1;
}
// Build HTML
left_html = "";
for each  name in left_col
{
	left_html = left_html + name + "<br>";
}
right_html = "";
for each  name in right_col
{
	right_html = right_html + name + "<br>";
}
divider_style = "";
right_padding = "";
if(right_col.size() > 0)
{
	divider_style = "border-right:1px solid #444;";
	right_padding = "padding-left:12px;";
}
participants_html = "<table width='100%' cellpadding='4' cellspacing='0' style='border-collapse:collapse;'>" + "<tr>" + "<td width='50%' style='vertical-align:top;" + divider_style + "'>" + left_html + "</td>" + "<td width='50%' style='vertical-align:top;" + right_padding + "'>" + right_html + "</td>" + "</tr></table>";
// info participants_html;
todayNotes.Participants_RT=participants_html;
// info todayNotes.Meeting_Detail;
