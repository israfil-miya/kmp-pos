const generateUniqueCode = (value: string): string => {
  // Get the current date and time in the format YYYYMMDDHHMMSS
  const dateTimeString = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);

  // Combine the value string and dateTimeString
  const combinedString = value + dateTimeString;

  // Hash the combined string using a simple hash function (e.g., DJB2)
  let hash = 5381;
  for (let i = 0; i < combinedString.length; i++) {
    hash = (hash * 33) ^ combinedString.charCodeAt(i);
  }

  // Convert the hash to a base36 string
  let base36Code = Math.abs(hash).toString(36).toUpperCase();

  // Ensure the code has a minimum length of 8 characters
  if (base36Code.length < 8) {
    base36Code = base36Code.padEnd(8, '0'); // Pad with '0' to ensure length
  } else {
    base36Code = base36Code.slice(0, 8); // Ensure it doesn't exceed 8 characters
  }

  return base36Code;
};

export default generateUniqueCode;
