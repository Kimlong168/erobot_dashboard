const convertToPhoneNumber = (input) => {
  // Assuming the input is always 9 digits

  const firstPart = input.slice(0, 3);
  const secondPart = input.slice(3, 6);
  const thirdPart = input.slice(6);

  const formattedPhoneNumber = `${firstPart} ${secondPart} ${thirdPart}`;
  return formattedPhoneNumber;
};

export default convertToPhoneNumber;
