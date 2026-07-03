// Company Meeting - Created or Edited - User input of Meeting Time to - Validate From Time
// Execute only if Meeting_Time_from is not null
fromTime = input.Meeting_Time_from;
endTime = input.Meeting_Time_to;
if(fromTime >= endTime)
{
	alert "From time cannot be after or same as the End time.";
	input.Meeting_Time_to = "";
}
