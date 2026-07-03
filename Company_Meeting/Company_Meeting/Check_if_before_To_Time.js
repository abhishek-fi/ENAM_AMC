// Company Meeting - Created or Edited - User input of Meeting Time from - Check if before To Time
// Execute only if Meeting_Time_to is not null
fromTime = input.Meeting_Time_from;
endTime = input.Meeting_Time_to;
if(fromTime >= endTime)
{
	alert "From Time cannot be after or same as the End Time.";
	input.Meeting_Time_from = "";
}
