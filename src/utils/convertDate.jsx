function convertDate(inputDate) {
  inputDate = inputDate.toUpperCase();
  const months = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };

  const parts = inputDate.split(" ");

  if (parts.length === 3) {
    const month = months[parts[0].trim()];
    const day = parts[1].replace(",", "");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  }

  // Return null for invalid input
  return null;
}

export default convertDate;
