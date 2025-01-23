// Function to get the timestamp of a specific date
const getTimestamp = (dateString) => {
  const date = new Date(dateString); // Create a date object from the string
  return date.getTime(); // Get the timestamp in milliseconds
};

export default getTimestamp;
