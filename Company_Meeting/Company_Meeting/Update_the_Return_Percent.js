// Company Meeting - Created or Edited - User input of Target price - Update the Return Percent
targetPrice = input.Target_price;
returnPercent = ((input.Target_price - input.Closing_Price) / input.Closing_Price * 100).round(2);
input.Return_Percent = returnPercent;
