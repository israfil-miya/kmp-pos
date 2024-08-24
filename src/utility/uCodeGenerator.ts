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

  // Convert the hash to a base36 string, then split into digits and letters
  const base36Code = Math.abs(hash).toString(36).toUpperCase();

  // Extract the first 8 characters, ensuring a mix of letters and digits
  const code = base36Code.replace(/[^A-Z0-9]/g, '').slice(0, 8);

  return code;
};

export default generateUniqueCode;
