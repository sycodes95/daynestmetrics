export const formatDateForUser = (date: string) => {
  const parts = date.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JavaScript Date
  const day = parseInt(parts[2]);

  const dateObject = new Date(year, month, day);

  // Create an options object to pass to toLocaleDateString for formatting
  const options = { year: 'numeric', month: 'short', day: '2-digit' };

  // Format the date to the desired output
  const formattedDate = dateObject.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);

  return formattedDate

}