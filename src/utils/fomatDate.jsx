function formatDate(inputDate) {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedDate = new Date(inputDate).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

export default formatDate;
